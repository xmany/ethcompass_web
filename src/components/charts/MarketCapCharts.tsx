'use client';

import { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { generateLineData, generateTimeLabels, mockMarketCapData } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartOptions, commonChartOptions } from '@/utils/chartConfig';

export default function MarketCapCharts() {
  const { theme } = useTheme();
  const [doughnutData, setDoughnutData] = useState<any>(null);
  const [lineData, setLineData] = useState<any>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    // Doughnut chart data
    setDoughnutData({
      labels: mockMarketCapData.map(d => d.name),
      datasets: [{
        data: mockMarketCapData.map(d => d.value),
        backgroundColor: mockMarketCapData.map(d => d.color),
        borderColor: 'var(--bg-card)',
        borderWidth: 4,
      }]
    });

    // Line chart data
    setLineData({
      labels: generateTimeLabels(12),
      datasets: [{
        label: 'Total Crypto Market Cap',
        data: generateLineData(12, 2.5, 0.5),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.1
      }]
    });
  }, []);

  const doughnutOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        position: 'bottom' as const,
        labels: {
          color: getChartOptions(isLight).color
        }
      },
      datalabels: {
        formatter: (value: number) => value + '%',
        color: isLight ? '#ffffff' : '#111827',
        font: { weight: 'bold' as const }
      }
    }
  };

  const lineOptions = {
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
        title: {
          display: true,
          text: 'Market Cap (Trillions USD)',
          color: getChartOptions(isLight).color
        },
        ticks: {
          color: getChartOptions(isLight).color
        },
        grid: {
          color: getChartOptions(isLight).gridColor
        }
      }
    },
    plugins: {
      ...commonChartOptions.plugins,
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      },
      datalabels: { display: false }
    }
  };

  if (!doughnutData || !lineData) return null;

  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        ETH 市值占比
      </h2>
      <div className="relative" style={{ height: '250px' }}>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
      
      <h2 className="text-xl font-bold mt-6 mb-4" style={{ color: 'var(--text-title)' }}>
        加密货币总市值 (12个月)
      </h2>
      <div className="relative" style={{ height: '200px' }}>
        <Line data={lineData} options={lineOptions} />
      </div>
    </DashboardCard>
  );
}
