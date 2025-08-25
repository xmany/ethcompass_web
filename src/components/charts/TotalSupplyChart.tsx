'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { generateLineData, generateTimeLabels } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartOptions, commonChartOptions } from '@/utils/chartConfig';
import { LineChartData } from '@/types/charts';

export default function TotalSupplyChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<LineChartData | null>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    setData({
      labels: generateTimeLabels(12),
      datasets: [
        {
          label: 'Total Supply',
          data: [120.2, 120.18, 120.15, 120.13, 120.11, 120.09, 120.08, 120.05, 120.04, 120.02, 120.01, 119.99],
          borderColor: '#3B82F6',
          backgroundColor: 'transparent',
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: 'Total Market Cap',
          data: generateLineData(12, 350, 50),
          borderColor: '#10B981',
          backgroundColor: 'transparent',
          tension: 0.1,
          yAxisID: 'y2',
        }
      ]
    });
  }, []);

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

  if (!data) return null;

  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        ETH 总供应量 & 市值 (12个月)
      </h2>
      <div className="relative" style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </DashboardCard>
  );
}
