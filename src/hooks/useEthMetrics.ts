'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { useFirebase } from '@/providers/FirebaseProvider';
import type { CandlestickData } from '@/utils/mockData';

interface FirestoreEthMetrics {
  timestamp: Timestamp;
  timestampISO: string;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  volume: number;
}

interface UseEthMetricsResult {
  data: CandlestickData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEthMetrics = (days: number = 30): UseEthMetricsResult => {
  const [data, setData] = useState<CandlestickData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { firestore } = useFirebase();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query Firestore for the latest ETH metrics
      const metricsRef = collection(firestore, 'daily_metrics_eth');
      const q = query(
        metricsRef,
        orderBy('timestamp', 'desc'),
        limit(days)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setData([]);
        return;
      }

      // Transform Firestore data to chart format
      const chartData: CandlestickData[] = [];
      
      querySnapshot.forEach((doc) => {
        const docData = doc.data() as FirestoreEthMetrics;
        
        // Convert Firestore Timestamp to JavaScript Date
        const date = docData.timestamp.toDate();
        
        chartData.push({
          x: date.getTime(),
          o: docData.price.open,
          h: docData.price.high,
          l: docData.price.low,
          c: docData.price.close,
          v: docData.volume
        });
      });

      // Sort by date (ascending) for proper chart display
      chartData.sort((a, b) => a.x - b.x);
      
      setData(chartData);
    } catch (err) {
      console.error('Error fetching ETH metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch ETH metrics');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: fetchData };
};
