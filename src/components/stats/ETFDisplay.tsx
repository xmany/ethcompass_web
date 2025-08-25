'use client';

import { mockETFData } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';

export default function ETFDisplay() {
  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        ETF 资金流向
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            每日净流入/流出
          </p>
          <p className={`text-3xl font-bold ${mockETFData.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {mockETFData.dailyFlow}
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            总资产管理规模 (AUM)
          </p>
          <p className="text-3xl font-bold">
            {mockETFData.totalAUM}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
