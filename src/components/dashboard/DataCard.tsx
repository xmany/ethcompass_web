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
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${changeColor === 'green' ? 'text-green-400' : 'text-white'}`}>
        {value}
      </p>
      {(change || suffix) && (
        <p className={`text-sm ${change ? changeColorClass : 'text-gray-400'}`}>
          {change || suffix}
        </p>
      )}
    </div>
  );
}
