import Image from 'next/image';

export interface InfluencerFeedCardProps {
  id: string;
  name: string;
  handle?: string;
  avatar: string;
  content: string;
  source: string;
  timeAgo: string;
  type: 'tweet' | 'interview' | 'podcast';
}

const typeIcons = {
  tweet: '🐦',
  interview: '📺',
  podcast: '🎙️'
};

export default function InfluencerFeedCard({
  name,
  handle,
  avatar,
  content,
  source,
  timeAgo,
  type
}: InfluencerFeedCardProps) {
  return (
    <div 
      className="rounded-xl p-6 border mb-4 transition-colors"
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      <div className="flex items-center text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
        <span className="mr-2">{typeIcons[type]}</span>
        <span>{source} · {timeAgo}</span>
      </div>
      
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 flex-shrink-0 overflow-hidden">
          <Image
            src={avatar}
            alt={name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {name}
            {handle && (
              <span className="font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>
                {handle}
              </span>
            )}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
