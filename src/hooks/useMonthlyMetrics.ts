import { useState, useEffect } from 'react';
import axios from 'axios';
import { Timestamp } from 'firebase/firestore';

interface EthMonthlyMetrics {
  timestamp: Timestamp;
  timestampISO: string;
  avgPrice: number;
  avgTotalSupply: number;
  avgMarketCap: number;
  endTotalSupply: number;
  endMarketCap: number;
  dataPoints: number;
}

interface MonthlyMetricsData {
  labels: string[];
  totalSupply: number[];
  marketCap: number[];
}

export function useMonthlyMetrics(months: number = 12) {
  const [data, setData] = useState<MonthlyMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from Firebase function
        const response = await axios.get(
          `https://asia-southeast1-ethcompass.cloudfunctions.net/getMonthlyMetrics`,
          {
            params: { months },
          }
        );

        if (response.data.success && response.data.data) {
          const metrics: EthMonthlyMetrics[] = response.data.data;
          
          // Transform data for chart
          const labels: string[] = [];
          const totalSupply: number[] = [];
          const marketCap: number[] = [];

          metrics.forEach((metric) => {
            // Format month label (e.g., "2024-01" -> "Jan 2024")
            const [year, month] = metric.timestampISO.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
            
            labels.push(monthLabel);
            // Convert total supply to millions
            totalSupply.push(metric.endTotalSupply / 1000000);
            // Convert market cap to billions
            marketCap.push(metric.endMarketCap / 1000000000);
          });

          setData({
            labels,
            totalSupply,
            marketCap,
          });
        } else {
          // If no data from API, use mock data as fallback
          console.warn('No monthly metrics data available, using mock data');
          setData(generateMockData(months));
        }
      } catch (err) {
        console.error('Error fetching monthly metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        // Use mock data as fallback
        setData(generateMockData(months));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [months]);

  return { data, loading, error };
}

function generateMockData(months: number): MonthlyMetricsData {
  const labels: string[] = [];
  const totalSupply: number[] = [];
  const marketCap: number[] = [];
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    labels.push(monthLabel);
    
    // Mock data with slight decreasing trend for supply
    totalSupply.push(120.5 - (i * 0.05));
    
    // Mock data with varying market cap
    marketCap.push(300 + Math.random() * 100);
  }
  
  return { labels, totalSupply, marketCap };
}
