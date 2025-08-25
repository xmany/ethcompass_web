interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({ children, className = "" }: DashboardCardProps) {
  return (
    <div 
      className={`rounded-xl p-6 border transition-colors ${className}`}
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      {children}
    </div>
  );
}
