import {onRequest} from "firebase-functions/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import axios from "axios";
import { kDailyMetricsEthCollection } from "./config";

// Get Firestore with the named database 'ethfirestore' as configured in firebase.json
// Using the proper API for firebase-admin v12+
const db = getFirestore("ethfirestore");

/**
 * Interface for ETH daily metrics document
 */
interface EthDailyMetrics {
  timestamp: admin.firestore.Timestamp;
  timestampISO: string;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  volume: number;
  createdAt?: admin.firestore.Timestamp;  // Optional for reading existing docs without this field
  updatedAt?: admin.firestore.Timestamp;  // Optional for reading existing docs without this field
}

/**
 * Interface for CoinGecko OHLC candle data
 */
interface OHLCCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Interface for aggregated daily OHLC data
 */
interface DailyOHLC {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Helper function to parse CoinGecko OHLC array format
 * @param candle Array format: [timestamp, open, high, low, close]
 * @returns Parsed OHLC candle object
 */
function parseOHLCCandle(candle: number[]): OHLCCandle {
  return {
    timestamp: candle[0],
    open: candle[1],
    high: candle[2],
    low: candle[3],
    close: candle[4],
  };
}

/**
 * Helper function to get date string (YYYY-MM-DD) from timestamp
 * @param timestamp Unix timestamp in milliseconds
 * @returns Date string in YYYY-MM-DD format
 */
function getDateString(timestamp: number): string {
  const date = new Date(timestamp);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().split("T")[0];
}

/**
 * Get the valid OHLC API days parameter based on days needed
 * CoinGecko OHLC API only accepts: 1, 7, 14, 30, 90, 180, 365
 * 
 * @param daysNeeded Number of days we need data for
 * @returns Valid days parameter for the API
 */
function getValidOHLCDays(daysNeeded: number): number {
  const validDays = [1, 7, 14, 30, 90, 180, 365];
  // Find the smallest valid value that covers our needs
  for (const validDay of validDays) {
    if (validDay >= daysNeeded) {
      return validDay;
    }
  }
  return 365; // Maximum
}

/**
 * Determine the candle granularity based on days requested
 * According to CoinGecko API documentation:
 * - 1 day: 30 minutes
 * - 7 days: 4 hours  
 * - 14 days: 4 hours
 * - 30 days: 4 hours
 * - 90 days: 4 days
 * - 180 days: 4 days
 * - 365 days: 4 days
 * 
 * @param days Valid API days parameter (1, 7, 14, 30, 90, 180, 365)
 * @returns Candle granularity description
 */
function getCandleGranularity(days: number): string {
  if (days === 1) return "30-minute";
  if (days <= 30) return "4-hour";
  return "4-day";
}

/**
 * Aggregate candles of any granularity into daily OHLC data
 * Handles 30-minute, 4-hour, and 4-day candles from CoinGecko
 * 
 * Note: The timestamp in CoinGecko response indicates the END (close) time of the candle
 * 
 * @param candles Array of candles from CoinGecko
 * @param daysRequested Number of days that were requested (to determine granularity)
 * @returns Map of date strings to daily OHLC data
 */
function aggregateCandlesToDaily(
  candles: number[][],
  daysRequested: number
): Map<string, DailyOHLC> {
  const dailyData = new Map<string, DailyOHLC>();
  const validDays = getValidOHLCDays(daysRequested);
  const granularity = getCandleGranularity(validDays);
  
  // If we're getting 4-day candles, we need a different aggregation strategy
  if (granularity === "4-day") {
    // For 4-day candles, each candle might span multiple days
    // We'll use the candle's data for the date it closes on
    for (const candleArray of candles) {
      const candle = parseOHLCCandle(candleArray);
      // The timestamp is the CLOSE time of the candle
      const closeDate = getDateString(candle.timestamp);
      
      // For 4-day candles, we'll just use the candle's OHLC as-is for the close date
      // This is an approximation but the best we can do with 4-day granularity
      dailyData.set(closeDate, {
        date: closeDate,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      });
    }
  } else {
    // For 30-minute or 4-hour candles, aggregate by date
    const candlesByDate = new Map<string, OHLCCandle[]>();

    // Group candles by date based on their close time
    for (const candleArray of candles) {
      const candle = parseOHLCCandle(candleArray);
      // The timestamp is the CLOSE time of the candle
      const dateStr = getDateString(candle.timestamp);

      if (!candlesByDate.has(dateStr)) {
        candlesByDate.set(dateStr, []);
      }
      candlesByDate.get(dateStr)!.push(candle);
    }

    // Aggregate each day's candles
    for (const [dateStr, dayCandles] of candlesByDate) {
      if (dayCandles.length === 0) continue;

      // Sort candles by timestamp to ensure correct open/close
      dayCandles.sort((a, b) => a.timestamp - b.timestamp);

      // Open is the open of the first candle of the day
      const open = dayCandles[0].open;
      // Close is the close of the last candle of the day
      const close = dayCandles[dayCandles.length - 1].close;
      // High is the maximum high of all candles
      let high = dayCandles[0].high;
      // Low is the minimum low of all candles
      let low = dayCandles[0].low;

      for (const candle of dayCandles) {
        high = Math.max(high, candle.high);
        low = Math.min(low, candle.low);
      }

      dailyData.set(dateStr, {
        date: dateStr,
        open,
        high,
        low,
        close,
      });
    }
  }

  return dailyData;
}

/**
 * Get daily OHLC data for a specific date from 4-hour candles
 * @param candles Array of 4-hour candles from CoinGecko
 * @param targetDate The specific date to get data for
 * @returns Daily OHLC data for the target date, or null if not found
 */
function getDailyOHLCForDate(
  candles: number[][],
  targetDate: Date
): DailyOHLC | null {
  const targetStart = targetDate.getTime();
  const targetEnd = targetStart + 24 * 60 * 60 * 1000;

  // Filter candles that belong to the target date
  const targetCandles: OHLCCandle[] = [];
  for (const candleArray of candles) {
    const candle = parseOHLCCandle(candleArray);
    if (candle.timestamp >= targetStart && candle.timestamp < targetEnd) {
      targetCandles.push(candle);
    }
  }

  if (targetCandles.length === 0) {
    return null;
  }

  // Sort candles by timestamp
  targetCandles.sort((a, b) => a.timestamp - b.timestamp);

  const open = targetCandles[0].open;
  const close = targetCandles[targetCandles.length - 1].close;
  let high = targetCandles[0].high;
  let low = targetCandles[0].low;

  for (const candle of targetCandles) {
    high = Math.max(high, candle.high);
    low = Math.min(low, candle.low);
  }

  return {
    date: getDateString(targetDate.getTime()),
    open,
    high,
    low,
    close,
  };
}

/**
 * Scheduled function to fetch ETH daily data
 * Runs every day at 00:05 UTC
 */
export const fetchEthDailyData = onSchedule(
  {
    schedule: "5 0 * * *", // Run at 00:05 UTC daily
    timeZone: "UTC",
    retryCount: 3,
    maxRetrySeconds: 600,
  },
  async (event): Promise<void> => {
    try {

      // Get yesterday's date (since we're fetching completed day's data)
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(0, 0, 0, 0);

      const dateStr = yesterday.toISOString().split("T")[0]; // YYYY-MM-DD format

      logger.info(`Starting ETH daily data fetch ${dateStr}`, {structuredData: true});

      // Fetch OHLC data from CoinGecko API
      // Using the free tier API endpoint
      // Use 7 days to ensure we have data for yesterday (will get 4-hour candles)
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum/ohlc",
        {
          params: {
            // x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
            vs_currency: "usd",
            days: 7, // Use 7 days (valid value) to get recent data with 4-hour candles
            precision: 0, // No decimal places
          },
        }
      );

      if (!response.data || response.data.length === 0) {
        throw new Error("No data received from CoinGecko API");
      }

      // Use helper function to get daily OHLC from 4-hour candles
      const dailyOHLC = getDailyOHLCForDate(response.data, yesterday);
      
      if (!dailyOHLC) {
        throw new Error("No data available for yesterday");
      }

      // Fetch volume data using market_chart API with 2 days (to get yesterday's data)
      // market_chart API accepts any number of days, not limited like OHLC
      const volumeResponse = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum/market_chart",
        {
          params: {
            // x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
            vs_currency: "usd",
            days: 2, // Only fetch 2 days to get yesterday's volume
            interval: "daily",
            precision: 0, // No decimal places
          },
        }
      );

      // Find volume for yesterday
      let volume = 0;
      if (volumeResponse.data && volumeResponse.data.total_volumes) {
        for (const vol of volumeResponse.data.total_volumes) {
          const volDate = new Date(vol[0]);
          volDate.setUTCHours(0, 0, 0, 0);
          if (volDate.getTime() === yesterday.getTime()) {
            volume = vol[1];
            break;
          }
        }
      }

      // Create the document data
      const now = admin.firestore.Timestamp.now();
      const docData: EthDailyMetrics = {
        timestamp: admin.firestore.Timestamp.fromDate(yesterday),
        timestampISO: yesterday.toISOString(),
        price: {
          open: dailyOHLC.open,
          high: dailyOHLC.high,
          low: dailyOHLC.low,
          close: dailyOHLC.close,
        },
        volume: volume,
        createdAt: now,
        updatedAt: now,
      };

      // Save to Firestore with date as document ID
      await db.collection(kDailyMetricsEthCollection).doc(dateStr).set(docData);

      logger.info(`Successfully saved ETH data for ${dateStr}`, {
        structuredData: true,
        data: docData,
      });

      return;
    } catch (error) {
      logger.error("Error fetching ETH daily data", {
        structuredData: true,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
);

/**
 * HTTP function to manually trigger ETH data fetch
 * Useful for testing and backfilling data
 * https://asia-southeast1-ethcompass.cloudfunctions.net/fetchEthDataManual
 */
export const fetchEthDataManual = onRequest(
  {
    maxInstances: 5,
    cors: true,
  },
  async (request, response) => {
    try {
      logger.info("Manual ETH data fetch triggered", {structuredData: true});

      // Get date from query parameter or use day before yesterday (safer for API availability)
      let targetDate = new Date();
      if (request.query.date && typeof request.query.date === "string") {
        targetDate = new Date(request.query.date);
      } else {
        // Use day before yesterday by default to ensure data is available
        targetDate.setUTCDate(targetDate.getUTCDate() - 2);
      }
      targetDate.setUTCHours(0, 0, 0, 0);

      const dateStr = targetDate.toISOString().split("T")[0];

      // Calculate days difference from today for API call
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const daysDiff = Math.ceil(
        (today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff < 1 || daysDiff > 365) {
        response.status(400).send({
          error: "Date must be within the last 365 days and not in the future",
        });
        return;
      }

      // Fetch OHLC data from CoinGecko API
      // API only accepts specific days values: 1, 7, 14, 30, 90, 180, 365
      const validDays = getValidOHLCDays(daysDiff + 1);
      const granularity = getCandleGranularity(validDays);
      
      logger.info("Fetching OHLC data", {
        targetDate: dateStr,
        daysDiff: daysDiff,
        validDays: validDays,
        granularity: granularity,
      });

      let ohlcResponse;
      try {
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
        ohlcResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/ethereum/ohlc",
          {
            params: {
              // x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
              vs_currency: "usd",
              days: validDays, // Use valid days value
              precision: 0, // No decimal places
            },
            timeout: 10000, // 10 second timeout
          }
        );
      } catch (apiError: any) {
        logger.error("CoinGecko OHLC API error for coins/ethereum/ohlc", {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          message: apiError.message,
        });
        throw new Error(
          `CoinGecko API error for coins/ethereum/ohlc: ${apiError.response?.status || "Network error"} - ${
            apiError.response?.statusText || apiError.message
          }`
        );
      }

      if (!ohlcResponse.data || ohlcResponse.data.length === 0) {
        throw new Error("No data received from CoinGecko API");
      }

      // Use helper function to get daily OHLC from candles
      const dailyOHLC = getDailyOHLCForDate(ohlcResponse.data, targetDate);
      
      if (!dailyOHLC) {
        throw new Error("No data available for the specified date");
      }

      // Fetch volume data using exact days needed
      // market_chart API accepts any number of days, unlike OHLC
      let volumeResponse;
      try {
        volumeResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/ethereum/market_chart",
          {
            params: {
              // x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
              vs_currency: "usd",
              days: daysDiff + 1, // Use exact days needed (add 1 to include target date)
              interval: "daily",
              precision: 0, // No decimal places
            },
          }
        );
      } catch (apiError: any) {
        logger.error("CoinGecko market_chart API error for coins/ethereum/market_chart", {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          message: apiError.message,
        });
        // Don't fail completely if volume data fails, just set to 0
        volumeResponse = { data: { total_volumes: [] } };
      }

      // Find volume for the target date
      let volume = 0;
      if (volumeResponse.data && volumeResponse.data.total_volumes) {
        for (const vol of volumeResponse.data.total_volumes) {
          const volDate = new Date(vol[0]);
          volDate.setUTCHours(0, 0, 0, 0);
          if (volDate.getTime() === targetDate.getTime()) {
            volume = vol[1];
            break;
          }
        }
      }

      // Create the document data
      const docData: EthDailyMetrics = {
        timestamp: admin.firestore.Timestamp.fromDate(targetDate),
        timestampISO: targetDate.toISOString(),
        price: {
          open: dailyOHLC.open,
          high: dailyOHLC.high,
          low: dailyOHLC.low,
          close: dailyOHLC.close,
        },
        volume: volume,
      };
      const now = admin.firestore.Timestamp.now();

      // Save to Firestore
      const docRef = await db.collection(kDailyMetricsEthCollection).doc(dateStr).get();
      if (docRef.exists) {
        await docRef.ref.update({
          ...docData,
          updatedAt: now,
        });
      } else {
        docData.createdAt = now;
        docData.updatedAt = now;
        await docRef.ref.set(docData);
      }

      logger.info(`Successfully saved ETH data for ${dateStr}`, {
        structuredData: true,
        data: docData,
      });

      response.status(200).send({
        success: true,
        date: dateStr,
        data: docData,
      });
    } catch (error) {
      logger.error("Error in manual ETH data fetch", {
        structuredData: true,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      response.status(500).send({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

/**
 * HTTP function to backfill historical data
 * Fetches data for the last N days
 * https://asia-southeast1-ethcompass.cloudfunctions.net/backfillEthData
 */
export const backfillEthData = onRequest(
  {
    maxInstances: 2,
    cors: true,
  },
  async (request, response) => {
    try {
      const daysToFetch = parseInt(
        (request.query.days as string) || "30",
        10
      );

      if (daysToFetch < 1 || daysToFetch > 365) {
        response.status(400).send({
          error: "Days must be between 1 and 365",
        });
        return;
      }

      logger.info(`Starting backfill for ${daysToFetch} days`, {
        structuredData: true,
      });

      // Fetch OHLC data
      // API only accepts specific days values: 1, 7, 14, 30, 90, 180, 365
      const validDays = getValidOHLCDays(daysToFetch);
      const granularity = getCandleGranularity(validDays);
      
      logger.info("Fetching OHLC data for backfill", {
        daysToFetch: daysToFetch,
        validDays: validDays,
        granularity: granularity,
      });
      
      const ohlcResponse = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum/ohlc",
        {
          params: {
            // x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
            vs_currency: "usd",
            days: validDays, // Use valid days value
            precision: 0, // No decimal places
          },
        }
      );

      if (!ohlcResponse.data || ohlcResponse.data.length === 0) {
        throw new Error("No OHLC data received from CoinGecko API");
      }

      // Fetch volume data using exact days needed
      // market_chart API accepts any number of days, unlike OHLC
      const volumeResponse = await axios.get(
        "https://api.coingecko.com/api/v3/coins/ethereum/market_chart",
        {
          params: {
            // x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
            vs_currency: "usd",
            days: daysToFetch, // Use exact days requested since market_chart accepts any number
            interval: "daily",
          },
        }
      );

      const volumeMap = new Map<string, number>();
      if (volumeResponse.data && volumeResponse.data.total_volumes) {
        for (const vol of volumeResponse.data.total_volumes) {
          const date = new Date(vol[0]);
          date.setUTCHours(0, 0, 0, 0);
          const dateStr = date.toISOString().split("T")[0];
          volumeMap.set(dateStr, vol[1]);
        }
      }

      // Use helper function to aggregate candles into daily OHLC
      // The function handles different granularities (30-min, 4-hour, 4-day)
      const dailyData = aggregateCandlesToDaily(ohlcResponse.data, daysToFetch);

      // Process and save data for each day
      const batch = db.batch();
      let count = 0;

      for (const [dateStr, ohlc] of dailyData) {
        const date = new Date(dateStr + "T00:00:00Z");
        const now = admin.firestore.Timestamp.now();
        const docData: EthDailyMetrics = {
          timestamp: admin.firestore.Timestamp.fromDate(date),
          timestampISO: date.toISOString(),
          price: {
            open: ohlc.open,
            high: ohlc.high,
            low: ohlc.low,
            close: ohlc.close,
          },
          volume: volumeMap.get(dateStr) || 0,
          createdAt: now,
          updatedAt: now,
        };

        const docRef = db.collection(kDailyMetricsEthCollection).doc(dateStr);
        batch.set(docRef, docData);
        count++;

        // Firestore has a limit of 500 operations per batch
        if (count % 400 === 0) {
          await batch.commit();
          logger.info(`Committed batch of ${count} documents`);
        }
      }

      // Commit remaining documents
      await batch.commit();

      logger.info(`Successfully backfilled ${count} days of ETH data`, {
        structuredData: true,
      });

      response.status(200).send({
        success: true,
        daysProcessed: count,
      });
    } catch (error) {
      logger.error("Error in backfill", {
        structuredData: true,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      response.status(500).send({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
