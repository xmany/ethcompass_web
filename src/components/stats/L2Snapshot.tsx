'use client';

import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { mockL2Data } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartOptions, commonChartOptions } from '@/utils/chartConfig';
import { DoughnutChartData } from '@/types/charts';

export default function L2Snapshot() {
  const { theme } = useTheme();
  const [data, setData] = useState<DoughnutChartData | null>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    setData({
      labels: mockL2Data.distribution.map(d => d.name),
      datasets: [{
        data: mockL2Data.distribution.map(d => d.value),
        backgroundColor: mockL2Data.distribution.map(d => d.color),
        borderColor: 'var(--bg-card)',
        borderWidth: 4,
      }]
    });
  }, []);

  const options = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
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

  if (!data) return null;

  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        Layer 2 生态快照
      </h2>
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            总锁仓量 (TVL)
          </p>
          <p className="text-2xl font-bold">{mockL2Data.totalTVL}</p>
        </div>
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            24小时交易费
          </p>
          <p className="text-2xl font-bold">{mockL2Data.dailyFees}</p>
        </div>
        <div className="relative" style={{ height: '200px' }}>
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </DashboardCard>
  );
}
