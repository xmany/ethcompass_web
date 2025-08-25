'use client';

import { mockTreasuryCompanies } from '@/utils/mockData';
import DashboardCard from '@/components/common/DashboardCard';

export default function TreasuryTable() {
  return (
    <DashboardCard>
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-title)' }}>
        ETH Treasury 公司追踪
      </h2>
      
      <div className="overflow-x-auto horizontal-scroll">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
            <tr>
              <th className="py-2 px-3">公司</th>
              <th className="py-2 px-3">持仓量 (ETH)</th>
              <th className="py-2 px-3">价值 (USD)</th>
              <th className="py-2 px-3">股价</th>
              <th className="py-2 px-3">市值</th>
              <th className="py-2 px-3">mNAV</th>
              <th className="py-2 px-3">占总供应量</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {mockTreasuryCompanies.map((company) => (
              <tr key={company.ticker}>
                <td className="py-3 px-3 font-medium">
                  {company.name} ({company.ticker})
                </td>
                <td className="py-3 px-3">{company.ethHoldings.toLocaleString()}</td>
                <td className="py-3 px-3">{company.valueUSD}</td>
                <td className="py-3 px-3">{company.stockPrice}</td>
                <td className="py-3 px-3">{company.marketCap}</td>
                <td className="py-3 px-3">
                  <span className={`font-medium ${parseInt(company.mNav) > 100 ? 'text-green-400' : ''}`}>
                    {company.mNav}
                  </span>
                </td>
                <td className="py-3 px-3">{company.percentOfSupply}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
