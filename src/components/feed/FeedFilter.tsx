'use client';

import { useState } from 'react';

export interface FilterState {
  source: string[];
  type: string[];
  importance: string[];
}

interface FeedFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const filterOptions = {
  source: [
    { value: 'coindesk', label: 'CoinDesk' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'bankless', label: 'Bankless' },
    { value: 'techflow', label: '深潮TechFlow' },
  ],
  type: [
    { value: 'news', label: '新闻' },
    { value: 'analysis', label: '深度分析' },
    { value: 'rumor', label: '市场传闻' },
    { value: 'alert', label: '价格预警' },
  ],
  importance: [
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
  ],
};

export default function FeedFilter({ onFilterChange }: FeedFilterProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    source: ['coindesk', 'twitter', 'bankless', 'techflow'],
    type: ['news', 'analysis', 'rumor', 'alert'],
    importance: ['high', 'medium', 'low'],
  });

  const toggleFilter = (group: keyof FilterState, value: string) => {
    const newFilters = { ...filters };
    const index = newFilters[group].indexOf(value);
    
    if (index > -1) {
      newFilters[group] = newFilters[group].filter(v => v !== value);
    } else {
      newFilters[group] = [...newFilters[group], value];
    }
    
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setShowFilter(false);
  };

  const resetFilters = () => {
    const allFilters: FilterState = {
      source: filterOptions.source.map(o => o.value),
      type: filterOptions.type.map(o => o.value),
      importance: filterOptions.importance.map(o => o.value),
    };
    setFilters(allFilters);
    onFilterChange(allFilters);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-title)' }}>统一信息流</h2>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center text-blue-400 text-sm px-3 py-1 rounded-md hover:opacity-80 transition"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          筛选信息
        </button>
      </div>

      {showFilter && (
        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-title)' }}>信息来源</h4>
              <div className="space-y-1">
                {filterOptions.source.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.source.includes(option.value)}
                      onChange={() => toggleFilter('source', option.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                      style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                    />
                    <span className="ml-2 text-sm" style={{ color: 'var(--text-primary)' }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-title)' }}>信息类型</h4>
              <div className="space-y-1">
                {filterOptions.type.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(option.value)}
                      onChange={() => toggleFilter('type', option.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                      style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                    />
                    <span className="ml-2 text-sm" style={{ color: 'var(--text-primary)' }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-title)' }}>重要性</h4>
              <div className="space-y-1">
                {filterOptions.importance.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.importance.includes(option.value)}
                      onChange={() => toggleFilter('importance', option.value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                      style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                    />
                    <span className="ml-2 text-sm" style={{ color: 'var(--text-primary)' }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={resetFilters}
              className="text-sm hover:opacity-80 mr-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              重置筛选
            </button>
            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              应用
            </button>
          </div>
        </div>
      )}
    </>
  );
}
