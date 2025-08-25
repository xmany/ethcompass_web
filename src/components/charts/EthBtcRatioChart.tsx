'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { generateLineData, generateTimeLabels } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartOptions, commonChartOptions } from '@/utils/chartConfig';

export default function EthBtcRatioChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<any>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    setData({
      labels: generateTimeLabels(24),
      datasets: [
        {
          label: 'Price Ratio',
          data: generateLineData(24, 0.055, 0.005),
          borderColor: '#8B5CF6',
          backgroundColor: 'transparent',
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: 'Market Cap Ratio',
          data: generateLineData(24, 0.38, 0.02),
          borderColor: '#EC4899',
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
          text: 'Price Ratio',
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
          text: 'Market Cap Ratio',
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
        ETH/BTC 比率 (24个月)
      </h2>
      <div className="relative" style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </DashboardCard>
  );
}
