'use client';

import { useState } from 'react';
import InfluencerFeedCard, { type InfluencerFeedCardProps } from './InfluencerFeedCard';

const influencerData: InfluencerFeedCardProps[] = [
  {
    id: 'vitalik',
    name: 'Vitalik Buterin',
    handle: '@VitalikButerin',
    avatar: 'https://i.pravatar.cc/40?u=vitalik',
    content: 'The transition to Proof-of-Stake was just the beginning...',
    source: 'Twitter/X',
    timeAgo: '25分钟前',
    type: 'tweet'
  },
  {
    id: 'tomlee',
    name: 'Tom Lee',
    handle: '@fundstrat',
    avatar: 'https://i.pravatar.cc/40?u=tomlee',
    content: '【AI摘要】我们仍然看好以太坊。现货ETF的批准为机构投资者打开了大门，预计未来12个月内将有大量资金流入，ETH价格目标维持在$10,000。',
    source: 'CNBC 访谈',
    timeAgo: '8小时前',
    type: 'interview'
  },
  {
    id: 'arthur',
    name: 'Arthur Hayes',
    handle: '',
    avatar: 'https://i.pravatar.cc/40?u=arthur',
    content: '【AI摘要】全球流动性周期是影响加密资产价格的最关键因素...',
    source: 'Bankless 播客',
    timeAgo: '3小时前',
    type: 'podcast'
  }
];

export default function InfluencerFeed() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedInfluencers, setSelectedInfluencers] = useState<Set<string>>(
    new Set(['vitalik', 'tomlee'])
  );

  const toggleInfluencer = (id: string) => {
    const newSet = new Set(selectedInfluencers);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedInfluencers(newSet);
  };

  const filteredInfluencers = influencerData.filter(inf => 
    selectedInfluencers.has(inf.id)
  );

  return (
    <section id="influencers-section" className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-title)' }}>核心人物动态</h2>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="text-blue-400 text-sm hover:text-blue-300 transition-colors cursor-pointer"
        >
          筛选 {showFilter ? '▲' : '▼'}
        </button>
      </div>

      {showFilter && (
        <div 
          className="p-4 rounded-lg mb-4 border transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>选择要显示的人物：</p>
          <div className="space-y-3">
            {influencerData.map(inf => (
              <label key={inf.id} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedInfluencers.has(inf.id)}
                    onChange={() => toggleInfluencer(inf.id)}
                  />
                  <div className={`toggle-switch ${selectedInfluencers.has(inf.id) ? 'active' : ''}`}>
                    <div className="toggle-dot"></div>
                  </div>
                </div>
                <span className="ml-3" style={{ color: 'var(--text-primary)' }}>{inf.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div id="influencers-feed">
        {filteredInfluencers.map(inf => (
          <InfluencerFeedCard key={inf.id} {...inf} />
        ))}
      </div>
    </section>
  );
}
