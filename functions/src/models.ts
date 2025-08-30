import * as admin from "firebase-admin";

/**
 * Interface for ETH daily metrics document
 */
export interface EthDailyMetrics {
  timestamp: admin.firestore.Timestamp;
  timestampISO: string;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  volume: number;
  totalSupply?: number;  // Total ETH supply in circulation
  marketCap?: number;    // Market capitalization in USD
  createdAt?: admin.firestore.Timestamp;  // Optional for reading existing docs without this field
  updatedAt?: admin.firestore.Timestamp;  // Optional for reading existing docs without this field
}

/**
 * Interface for ETH monthly metrics document
 */
export interface EthMonthlyMetrics {
  timestamp: admin.firestore.Timestamp;
  timestampISO: string;  // YYYY-MM format
  avgPrice: number;      // Average closing price for the month
  avgTotalSupply: number;  // Average total supply for the month
  avgMarketCap: number;    // Average market cap for the month
  endTotalSupply: number;  // Total supply at end of month
  endMarketCap: number;    // Market cap at end of month
  dataPoints: number;      // Number of daily data points aggregated
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}
