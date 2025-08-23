'use client';

import { useState } from 'react';
import FeedCard from './FeedCard';
import FeedFilter, { FilterState } from './FeedFilter';

const mockFeedData = [
  {
    type: 'news' as const,
    source: 'CoinDesk',
    sourceKey: 'coindesk',
    timeAgo: '5分钟前',
    title: 'Ethereum Surges to New All-Time High Amid Likely September Rate Cut',
    importance: 'high' as const,
    category: 'news' as const,
    translation: {
      summary: [
        '由于市场预期九月可能降息，以太坊价格飙升至历史新高。',
        '大量空头头寸被清算，加剧了价格上涨的势头。',
        '分析师认为，宏观经济环境的转变是推动此次上涨的关键因素。'
      ],
      fullText: '在市场对美联储可能于九月降息的预期日益增强的背景下，以太坊价格今日飙升，创下新的历史最高纪录。这一强劲上涨导致价值数亿美元的空头头寸被清算，进一步推动了价格的上涨。分析师指出，宏观经济环境的鸽派转向，加上以太坊生态系统内部的积极发展，共同为此次破纪录的涨势奠定了基础。交易员们正密切关注即将发布的经济数据，以寻找有关未来货币政策走向的更多线索... (此处为AI翻译内容节选)'
    }
  },
  {
    type: 'tweet' as const,
    source: 'Twitter/X',
    sourceKey: 'twitter',
    timeAgo: '25分钟前',
    importance: 'medium' as const,
    category: 'analysis' as const,
    author: {
      name: 'Vitalik Buterin',
      handle: '@VitalikButerin',
      avatar: 'https://i.pravatar.cc/40?u=vitalik'
    },
    content: 'The transition to Proof-of-Stake was just the beginning. The next phase, "The Surge," will focus on scaling solutions like Danksharding, aiming for 100,000+ transactions per second. The future is scalable and secure.',
    translation: {
      fullText: '向权益证明（PoS）的过渡仅仅是个开始。下一阶段"The Surge"将专注于Danksharding等扩容解决方案，目标是实现每秒超过10万笔交易。未来是可扩展且安全的。'
    }
  },
  {
    type: 'news' as const,
    source: '深潮TechFlow',
    sourceKey: 'techflow',
    timeAgo: '1小时前',
    importance: 'medium' as const,
    category: 'analysis' as const,
    title: '解析EIP-7702：V神新提案如何改变以太坊账户抽象格局',
    summary: 'Vitalik Buterin最新提出的EIP-7702旨在引入一种新的交易类型，允许外部拥有账户（EOA）在单次交易中临时化身为智能合约钱包，极大地提升了用户体验和灵活性...'
  },
  {
    type: 'podcast' as const,
    source: 'Bankless 播客',
    sourceKey: 'bankless',
    timeAgo: '3小时前',
    importance: 'high' as const,
    category: 'analysis' as const,
    title: '【AI摘要】与Arthur Hayes探讨宏观经济与ETH的未来',
    summary: '• 宏观经济：全球流动性周期是影响加密资产价格的最关键因素。\n• ETH定位：以太坊作为"去中心化互联网的债券"，其价值将通过质押收益和通缩机制得到体现。\n• 未来预测：随着ETF的普及和机构资金的流入，ETH有望在下一轮牛市中表现超越比特币。'
  }
];

export default function UnifiedFeed() {
  const [filters, setFilters] = useState<FilterState>({
    source: ['coindesk', 'twitter', 'bankless', 'techflow'],
    type: ['news', 'analysis', 'rumor', 'alert'],
    importance: ['high', 'medium', 'low'],
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredData = mockFeedData.filter(item => {
    const sourceMatch = !item.sourceKey || filters.source.includes(item.sourceKey);
    const typeMatch = !item.category || filters.type.includes(item.category);
    const importanceMatch = !item.importance || filters.importance.includes(item.importance);
    
    return sourceMatch && typeMatch && importanceMatch;
  });

  return (
    <section id="unified-feed-section" className="mb-8 pt-8 lg:pt-0">
      <FeedFilter onFilterChange={handleFilterChange} />
      <div id="unified-feed">
        {filteredData.map((item, index) => (
          <FeedCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
