'use client';

import { mockBurnData } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';

export default function BurnRateDisplay() {
  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        ETH 销毁速率
      </h2>
      <div className="flex justify-around text-center">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            24小时销毁
          </p>
          <p className="text-2xl font-bold">
            {mockBurnData.burned24h} ETH
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            7天销毁
          </p>
          <p className="text-2xl font-bold">
            {mockBurnData.burned7d} ETH
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
