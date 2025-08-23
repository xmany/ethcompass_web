'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export interface FeedCardProps {
  type: 'news' | 'tweet' | 'podcast';
  source: string;
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
}

const typeIcons = {
  news: '📰',
  tweet: '🐦',
  podcast: '🎙️'
};

export default function FeedCard({
  type,
  source,
  timeAgo,
  title,
  content,
  summary,
  author,
  translation
}: FeedCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleTranslation = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setShowTranslation(!showTranslation);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  return (
    <div className="bg-[#1F2937] rounded-xl p-5 border border-[#374151] mb-4">
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <span className="mr-2">{typeIcons[type]}</span>
        <span>{source} · {timeAgo}</span>
      </div>

      {author && (
        <div className="flex items-start mb-3">
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
            {content && <p className="mt-1 text-gray-300 text-sm">{content}</p>}
          </div>
        </div>
      )}

      {title && !author && (
        <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
      )}

      {summary && (
        <div className="text-sm text-gray-400 mt-2">
          {summary.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-1' : ''}>
              {line}
            </p>
          ))}
        </div>
      )}

      {translation && (
        <>
          <button
            className="text-blue-400 text-sm mt-3 hover:text-blue-300 transition-colors"
            onClick={toggleTranslation}
          >
            {showTranslation ? '收起AI翻译' : '展开AI翻译'} {showTranslation ? '▲' : '▼'}
          </button>
          
          <div 
            ref={contentRef}
            className={`translation-content ${showTranslation ? 'expanded' : ''}`}
          >
            <div>
              {translation.summary && (
                <>
                  <p className="font-semibold mt-2 text-gray-200">【AI摘要】</p>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-1 text-gray-300">
                    {translation.summary.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {translation.fullText && (
                <>
                  <p className="font-semibold mt-3 text-gray-200">【AI全文翻译】</p>
                  <p className="text-sm mt-1 text-gray-300">{translation.fullText}</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
