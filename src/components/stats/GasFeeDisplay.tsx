'use client';

import { mockGasData } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';

export default function GasFeeDisplay() {
  return (
    <DashboardCard className="text-center">
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-title)' }}>
        主网 Gas 费用
      </h2>
      <p className="text-5xl font-extrabold my-4">
        {mockGasData.gwei} 
        <span className="text-3xl font-semibold ml-2" style={{ color: 'var(--text-secondary)' }}>
          Gwei
        </span>
      </p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        （{mockGasData.type}）
      </p>
    </DashboardCard>
  );
}
