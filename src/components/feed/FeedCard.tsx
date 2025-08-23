'use client';

import { useState } from 'react';
import Image from 'next/image';
import Tag from '../common/Tag';

export interface FeedCardProps {
  type: 'news' | 'tweet' | 'podcast';
  source: string;
  sourceKey?: string;
  timeAgo: string;
  title?: string;
  content?: string;
  summary?: string;
  author?: {
    name: string;
    handle?: string;
    avatar?: string;
  };
  translation?: {
    summary?: string[];
    fullText?: string;
  };
  importance?: 'high' | 'medium' | 'low';
  category?: 'news' | 'analysis' | 'rumor' | 'alert';
}

const typeIcons = {
  news: '📰',
  tweet: '🐦',
  podcast: '🎙️'
};

const importanceConfig = {
  high: { label: '高重要性', variant: 'red' as const },
  medium: { label: '中重要性', variant: 'yellow' as const },
  low: { label: '低重要性', variant: 'green' as const },
};

const categoryConfig = {
  news: { label: '新闻', variant: 'blue' as const },
  analysis: { label: '深度分析', variant: 'green' as const },
  rumor: { label: '市场传闻', variant: 'yellow' as const },
  alert: { label: '价格预警', variant: 'red' as const },
};

export default function FeedCard({
  type,
  source,
  sourceKey,
  timeAgo,
  title,
  content,
  summary,
  author,
  translation,
  importance,
  category
}: FeedCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <div 
      className="bg-[#1F2937] rounded-xl p-6 border border-[#374151] mb-4"
      data-source={sourceKey}
      data-type={category}
      data-importance={importance}
    >
      <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
        <div className="flex items-center">
          <span className="mr-2">{typeIcons[type]}</span>
          <span>{source} · {timeAgo}</span>
        </div>
        {(importance || category) && (
          <div className="flex items-center">
            {importance && (
              <Tag variant={importanceConfig[importance].variant}>
                {importanceConfig[importance].label}
              </Tag>
            )}
            {category && (
              <Tag variant={categoryConfig[category].variant}>
                {categoryConfig[category].label}
              </Tag>
            )}
          </div>
        )}
      </div>

      {author && (
        <div className="flex items-start mb-4">
          {author.avatar && (
            <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 flex-shrink-0 overflow-hidden">
              <Image 
                src={author.avatar} 
                alt={author.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white">
              {author.name}
              {author.handle && (
                <span className="text-gray-400 font-normal ml-1">
                  {author.handle}
                </span>
              )}
            </p>
            {content && <p className="mt-2 text-gray-300 text-[15px] leading-relaxed">{content}</p>}
          </div>
        </div>
      )}

      {title && !author && (
        <h3 className="text-lg font-semibold text-gray-100 mb-3">{title}</h3>
      )}

      {summary && (
        <div className="text-[15px] text-gray-400 mt-3 leading-relaxed">
          {summary.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          ))}
        </div>
      )}

      {translation && (
        <>
          <button
            className="text-blue-400 text-sm mt-4 hover:text-blue-300 transition-colors"
            onClick={toggleTranslation}
          >
            {showTranslation ? '收起AI翻译' : '展开AI翻译'} {showTranslation ? '▲' : '▼'}
          </button>
          
          <div className={`translation-content ${showTranslation ? 'expanded' : ''}`}>
            <div>
              {translation.summary && (
                <>
                  <p className="font-semibold mt-3 text-gray-200">【AI摘要】</p>
                  <ul className="list-disc list-inside text-[15px] space-y-2 mt-2 text-gray-300 leading-relaxed">
                    {translation.summary.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {translation.fullText && (
                <>
                  <p className="font-semibold mt-4 text-gray-200">【AI全文翻译】</p>
                  <p className="text-[15px] mt-2 text-gray-300 leading-relaxed">{translation.fullText}</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
