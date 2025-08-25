'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { generateBarData, mockStakingData } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartOptions, commonChartOptions } from '@/utils/chartConfig';

export default function StakingData() {
  const { theme } = useTheme();
  const [data, setData] = useState<any>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    const flowData = generateBarData(30, 20000);
    setData({
      labels: Array.from({ length: 30 }, (_, i) => i + 1),
      datasets: [{
        label: 'Net Staking Flow',
        data: flowData,
        backgroundColor: flowData.map(v => v >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)'),
      }]
    });
  }, []);

  const options = {
    ...commonChartOptions,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: { display: false }
      },
      y: {
        title: {
          display: true,
          text: 'ETH',
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
      datalabels: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            const label = value >= 0 ? '存入: ' : '提取: ';
            return label + Math.abs(value).toLocaleString() + ' ETH';
          }
        }
      }
    }
  };

  if (!data) return null;

  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        质押数据 (Staking)
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>总质押量</p>
          <p className="text-2xl font-bold">{mockStakingData.totalStaked}</p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>质押比例</p>
          <p className="text-2xl font-bold">{mockStakingData.stakingRatio}</p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>年化收益率 (APR)</p>
          <p className="text-2xl font-bold text-green-400">{mockStakingData.apr}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: 'var(--text-title)' }}>
        每日净质押流量
      </h3>
      <div className="relative" style={{ height: '150px' }}>
        <Bar data={data} options={options} />
      </div>
    </DashboardCard>
  );
}
