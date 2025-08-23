interface DataCardProps {
  label: string;
  value: string;
  change?: string;
  changeColor?: 'green' | 'red' | 'gray';
  suffix?: string;
}

export default function DataCard({ label, value, change, changeColor = 'gray', suffix }: DataCardProps) {
  const changeColorClass = {
    green: 'text-green-400',
    red: 'text-red-400',
    gray: 'text-gray-400'
  }[changeColor];

  return (
    <div 
      className="rounded-xl p-4 border transition-colors"
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <p className={`text-2xl font-bold ${changeColor === 'green' ? 'text-green-400' : ''}`}
         style={changeColor !== 'green' ? { color: 'var(--text-primary)' } : undefined}>
        {value}
      </p>
      {(change || suffix) && (
        <p className={`text-sm ${change ? changeColorClass : ''}`}
           style={!change ? { color: 'var(--text-secondary)' } : undefined}>
          {change || suffix}
        </p>
      )}
    </div>
  );
}
