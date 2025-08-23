interface TagProps {
  children: React.ReactNode;
  variant: 'red' | 'yellow' | 'green' | 'blue';
}

const variantStyles = {
  red: 'bg-red-900 text-red-200',
  yellow: 'bg-yellow-900 text-yellow-200',
  green: 'bg-green-900 text-green-200',
  blue: 'bg-blue-900 text-blue-200',
};

export default function Tag({ children, variant }: TagProps) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mr-2 ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
