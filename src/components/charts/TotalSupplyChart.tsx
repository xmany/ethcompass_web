'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DashboardCard from '@/components/common/DashboardCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartOptions, commonChartOptions } from '@/utils/chartConfig';
import { LineChartData } from '@/types/charts';
import { useMonthlyMetrics } from '@/hooks/useMonthlyMetrics';

export default function TotalSupplyChart() {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<LineChartData | null>(null);
  const isLight = theme === 'light';
  
  // Fetch real data from Firebase
  const { data: monthlyData, loading, error } = useMonthlyMetrics(12);

  useEffect(() => {
    if (monthlyData) {
      setChartData({
        labels: monthlyData.labels,
        datasets: [
          {
            label: 'Total Supply',
            data: monthlyData.totalSupply,
            borderColor: '#3B82F6',
            backgroundColor: 'transparent',
            tension: 0.1,
            yAxisID: 'y',
          },
          {
            label: 'Total Market Cap',
            data: monthlyData.marketCap,
            borderColor: '#10B981',
            backgroundColor: 'transparent',
            tension: 0.1,
            yAxisID: 'y2',
          }
        ]
      });
    }
  }, [monthlyData]);

  const options = {
    ...commonChartOptions,
    scales: {
      x: {
        grid: {
          color: getChartOptions(isLight).gridColor
        },
        ticks: {
          color: getChartOptions(isLight).color
        }
      },
      y: {
        position: 'left' as const,
        title: {
          display: true,
          text: 'ETH (Millions)',
          color: getChartOptions(isLight).color
        },
        ticks: {
          color: getChartOptions(isLight).color
        },
        grid: {
          color: getChartOptions(isLight).gridColor
        }
      },
      y2: {
        position: 'right' as const,
        title: {
          display: true,
          text: 'Market Cap (Billions USD)',
          color: getChartOptions(isLight).color
        },
        ticks: {
          color: getChartOptions(isLight).color
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        position: 'bottom' as const,
        labels: {
          color: getChartOptions(isLight).color
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      },
      datalabels: {
        display: false
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <DashboardCard>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
          ETH 总供应量 & 市值 (12个月)
        </h2>
        <div className="relative flex items-center justify-center" style={{ height: '300px' }}>
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardCard>
    );
  }

  // Show error state if there's an error and no data
  if (error && !chartData) {
    return (
      <DashboardCard>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
          ETH 总供应量 & 市值 (12个月)
        </h2>
        <div className="relative flex items-center justify-center" style={{ height: '300px' }}>
          <div className="text-red-500">Failed to load data. Using mock data.</div>
        </div>
      </DashboardCard>
    );
  }

  if (!chartData) return null;

  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        ETH 总供应量 & 市值 (12个月)
      </h2>
      <div className="relative" style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </DashboardCard>
  );
}
