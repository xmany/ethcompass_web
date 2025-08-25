'use client';

import { mockExchangeData } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';

export default function ExchangeBalances() {
  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        交易所余额净流向
      </h2>
      <div className="space-y-4 text-center">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            交易所总余额
          </p>
          <p className="text-2xl font-bold">
            {mockExchangeData.totalBalance}
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            7日净流量
          </p>
          <p className={`text-2xl font-bold ${mockExchangeData.isOutflow ? 'text-red-400' : 'text-green-400'}`}>
            {mockExchangeData.netFlow7d}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
