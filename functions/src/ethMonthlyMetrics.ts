import {onRequest} from "firebase-functions/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {getFirestore} from "firebase-admin/firestore";
import { kDailyMetricsEthCollection, kMonthlyMetricsEthCollection } from "./config";
import { EthDailyMetrics, EthMonthlyMetrics } from "./models";

// Get Firestore with the named database 'ethfirestore' as configured in firebase.json
const db = getFirestore("ethfirestore");

/**
 * Helper function to get month string (YYYY-MM) from date
 * @param date Date object
 * @returns Month string in YYYY-MM format
 */
function getMonthString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Helper function to get the first day of a month
 * @param year Year
 * @param month Month (1-12)
 * @returns Date object for the first day of the month
 */
function getFirstDayOfMonth(year: number, month: number): Date {
  const date = new Date(Date.UTC(year, month - 1, 1));
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/**
 * Helper function to get the last day of a month
 * @param year Year
 * @param month Month (1-12)
 * @returns Date object for the last day of the month
 */
function getLastDayOfMonth(year: number, month: number): Date {
  const date = new Date(Date.UTC(year, month, 0));
  date.setUTCHours(23, 59, 59, 999);
  return date;
}

/**
 * Aggregate daily metrics for a specific month
 * @param year Year
 * @param month Month (1-12)
 * @returns Aggregated monthly metrics or null if no data
 */
async function aggregateMonthlyData(year: number, month: number): Promise<EthMonthlyMetrics | null> {
  const firstDay = getFirstDayOfMonth(year, month);
  const lastDay = getLastDayOfMonth(year, month);
  
  // const firstDayStr = firstDay.toISOString().split('T')[0];
  // const lastDayStr = lastDay.toISOString().split('T')[0];
  
  // Query daily metrics for the month
  const snapshot = await db.collection(kDailyMetricsEthCollection)
    .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(firstDay))
    .where("timestamp", "<=", admin.firestore.Timestamp.fromDate(lastDay))
    .orderBy("timestamp")
    .get();
  
  if (snapshot.empty) {
    logger.info(`No daily data found for ${year}-${month}`);
    return null;
  }
  
  // Aggregate the data
  let totalPrice = 0;
  let totalSupply = 0;
  let totalMarketCap = 0;
  let dataPoints = 0;
  let endSupply = 0;
  let endMarketCap = 0;
  let lastDate: Date | null = null;
  
  snapshot.forEach(doc => {
    const data = doc.data() as EthDailyMetrics;
    
    // Add to totals for averaging
    totalPrice += data.price.close;
    dataPoints++;
    
    if (data.totalSupply) {
      totalSupply += data.totalSupply;
    }
    
    if (data.marketCap) {
      totalMarketCap += data.marketCap;
    }
    
    // Track the last day's values
    const docDate = data.timestamp.toDate();
    if (!lastDate || docDate > lastDate) {
      lastDate = docDate;
      endSupply = data.totalSupply || 0;
      endMarketCap = data.marketCap || 0;
    }
  });
  
  // Calculate averages
  const avgPrice = totalPrice / dataPoints;
  const avgTotalSupply = totalSupply / dataPoints;
  const avgMarketCap = totalMarketCap / dataPoints;
  
  const monthStr = getMonthString(firstDay);
  const now = admin.firestore.Timestamp.now();
  
  return {
    timestamp: admin.firestore.Timestamp.fromDate(firstDay),
    timestampISO: monthStr,
    avgPrice: avgPrice,
    avgTotalSupply: avgTotalSupply,
    avgMarketCap: avgMarketCap,
    endTotalSupply: endSupply,
    endMarketCap: endMarketCap,
    dataPoints: dataPoints,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Scheduled function to aggregate monthly data
 * Runs on the 2nd of each month at 01:00 UTC to aggregate previous month's data
 */
export const aggregateMonthlyMetrics = onSchedule(
  {
    schedule: "0 1 2 * *", // Run at 01:00 UTC on the 2nd of each month
    timeZone: "UTC",
    retryCount: 3,
    maxRetrySeconds: 600,
  },
  async (event): Promise<void> => {
    try {
      // Get previous month
      const now = new Date();
      const year = now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
      const month = now.getUTCMonth() === 0 ? 12 : now.getUTCMonth(); // getUTCMonth() returns 0-11
      
      logger.info(`Starting monthly aggregation for ${year}-${month}`, {structuredData: true});
      
      const monthlyData = await aggregateMonthlyData(year, month);
      
      if (!monthlyData) {
        logger.warn(`No data to aggregate for ${year}-${month}`);
        return;
      }
      
      // Save to Firestore
      const monthStr = getMonthString(getFirstDayOfMonth(year, month));
      await db.collection(kMonthlyMetricsEthCollection).doc(monthStr).set(monthlyData);
      
      logger.info(`Successfully aggregated monthly data for ${monthStr}`, {
        structuredData: true,
        data: monthlyData,
      });
    } catch (error) {
      logger.error("Error aggregating monthly data", {
        structuredData: true,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
);

/**
 * HTTP function to manually trigger monthly aggregation
 * Can aggregate for a specific month or multiple months
 * https://asia-southeast1-ethcompass.cloudfunctions.net/aggregateMonthlyMetricsManual
 */
export const aggregateMonthlyMetricsManual = onRequest(
  {
    maxInstances: 2,
    cors: true,
  },
  async (request, response) => {
    try {
      // Get parameters
      const monthsParam = request.query.months as string;
      const yearParam = request.query.year as string;
      const monthParam = request.query.month as string;

      logger.info(`Manual monthly aggregation triggered for year ${yearParam} month ${monthParam} months ${monthsParam}`, {structuredData: true});
      
      const results: any[] = [];
      
      if (yearParam && monthParam) {
        // Aggregate specific month
        const year = parseInt(yearParam, 10);
        const month = parseInt(monthParam, 10);
        
        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
          response.status(400).send({
            error: "Invalid year or month parameter",
          });
          return;
        }
        
        const monthlyData = await aggregateMonthlyData(year, month);
        
        if (monthlyData) {
          const monthStr = getMonthString(getFirstDayOfMonth(year, month));
          await db.collection(kMonthlyMetricsEthCollection).doc(monthStr).set(monthlyData);
          results.push({ month: monthStr, data: monthlyData });
        } else {
          results.push({ month: `${year}-${String(month).padStart(2, "0")}`, error: "No data found" });
        }
      } else {
        // Aggregate last N months
        const monthsToAggregate = parseInt(monthsParam || "12", 10);
        
        if (isNaN(monthsToAggregate) || monthsToAggregate < 1 || monthsToAggregate > 24) {
          response.status(400).send({
            error: "Months parameter must be between 1 and 24",
          });
          return;
        }
        
        const now = new Date();
        
        for (let i = 1; i <= monthsToAggregate; i++) {
          const targetDate = new Date(now);
          targetDate.setUTCMonth(targetDate.getUTCMonth() - i);
          
          const year = targetDate.getUTCFullYear();
          const month = targetDate.getUTCMonth() + 1; // getUTCMonth() returns 0-11
          
          try {
            const monthlyData = await aggregateMonthlyData(year, month);
            
            if (monthlyData) {
              const monthStr = getMonthString(getFirstDayOfMonth(year, month));
              await db.collection(kMonthlyMetricsEthCollection).doc(monthStr).set(monthlyData);
              results.push({ month: monthStr, data: monthlyData });
            } else {
              results.push({ month: `${year}-${String(month).padStart(2, "0")}`, error: "No data found" });
            }
          } catch (error) {
            results.push({ 
              month: `${year}-${String(month).padStart(2, "0")}`, 
              error: error instanceof Error ? error.message : "Unknown error" 
            });
          }
        }
      }
      
      logger.info("Monthly aggregation completed", {
        structuredData: true,
        results: results,
      });
      
      response.status(200).send({
        success: true,
        results: results,
      });
    } catch (error) {
      logger.error("Error in manual monthly aggregation", {
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
 * HTTP function to fetch monthly metrics for the frontend
 * Returns the last 12 months of data
 * https://asia-southeast1-ethcompass.cloudfunctions.net/getMonthlyMetrics
 */
export const getMonthlyMetrics = onRequest(
  {
    maxInstances: 10,
    cors: true,
  },
  async (request, response) => {
    try {
      const monthsParam = request.query.months as string;
      const months = parseInt(monthsParam || "12", 10);
      
      if (isNaN(months) || months < 1 || months > 24) {
        response.status(400).send({
          error: "Months parameter must be between 1 and 24",
        });
        return;
      }
      
      // Get the last N months of data
      const now = new Date();
      const startDate = new Date(now);
      startDate.setUTCMonth(startDate.getUTCMonth() - months);
      
      const snapshot = await db.collection(kMonthlyMetricsEthCollection)
        .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(startDate))
        .orderBy("timestamp", "asc")
        .get();
      
      const data: EthMonthlyMetrics[] = [];
      snapshot.forEach(doc => {
        data.push(doc.data() as EthMonthlyMetrics);
      });
      
      response.status(200).send({
        success: true,
        data: data,
      });
    } catch (error) {
      logger.error("Error fetching monthly metrics", {
        structuredData: true,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      response.status(500).send({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
