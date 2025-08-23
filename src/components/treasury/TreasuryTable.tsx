import FeedCard from '../feed/FeedCard';

interface TreasuryCompany {
  name: string;
  ticker: string;
  holdings: string;
  value: string;
  stockPrice: string;
  marketCap: string;
  mNAV: string;
  mNAVColor: 'green' | 'gray';
}

const treasuryData: TreasuryCompany[] = [
  {
    name: 'Bitmine Immersion',
    ticker: 'MNEE',
    holdings: '1,070,000',
    value: '$4.96B',
    stockPrice: '$12.50',
    marketCap: '$1.2B',
    mNAV: '413%',
    mNAVColor: 'green'
  },
  {
    name: 'SharpLink Gaming',
    ticker: 'SBET',
    holdings: '143,593',
    value: '$667M',
    stockPrice: '$0.88',
    marketCap: '$15M',
    mNAV: '4446%',
    mNAVColor: 'green'
  },
  {
    name: 'Metaplanet',
    ticker: 'JPX: 3350',
    holdings: '15,555',
    value: '$72M',
    stockPrice: '¥92',
    marketCap: '$60M',
    mNAV: '120%',
    mNAVColor: 'green'
  },
  {
    name: 'Coinbase',
    ticker: 'COIN',
    holdings: '12,000',
    value: '$55M',
    stockPrice: '$245.7',
    marketCap: '$58.4B',
    mNAV: '0.09%',
    mNAVColor: 'gray'
  }
];

export default function TreasuryTable() {
  return (
    <section id="treasuries-section" className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-title)' }}>ETH Treasury 公司追踪</h2>
      
      <div 
        className="rounded-xl p-5 border overflow-x-auto horizontal-scroll mb-4 transition-colors"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-color)' 
        }}
      >
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
            <tr>
              <th className="py-2 px-3">公司</th>
              <th className="py-2 px-3">持仓量 (ETH)</th>
              <th className="py-2 px-3">价值 (USD)</th>
              <th className="py-2 px-3">股价</th>
              <th className="py-2 px-3">市值</th>
              <th className="py-2 px-3">mNAV</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {treasuryData.map((company, index) => (
              <tr key={index}>
                <td className="py-3 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {company.name} ({company.ticker})
                </td>
                <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{company.holdings}</td>
                <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{company.value}</td>
                <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{company.stockPrice}</td>
                <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{company.marketCap}</td>
                <td className={`py-3 px-3 ${
                  company.mNAVColor === 'green' ? 'text-green-400' : ''
                }`}
                style={company.mNAVColor !== 'green' ? { color: 'var(--text-secondary)' } : undefined}>
                  {company.mNAV}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FeedCard
        type="news"
        source="Decrypt"
        timeAgo="1天前"
        title="Public Keys: Ethereum Treasuries Soar, Bitcoin ETFs' $1 Billion Bleed"
        summary="本周，持有ETH作为储备资产的公司数量显著增加，其中Bitmine的持仓价值已接近50亿美元，显示出企业对以太坊作为价值储存手段的信心日益增强..."
      />
    </section>
  );
}
