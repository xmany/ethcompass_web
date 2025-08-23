interface TagProps {
  children: React.ReactNode;
  variant: 'red' | 'yellow' | 'green' | 'blue';
}

export default function Tag({ children, variant }: TagProps) {
  const styles = {
    backgroundColor: `var(--tag-${variant}-bg)`,
    color: `var(--tag-${variant}-text)`,
  };

  return (
    <span 
      className="inline-block px-3 py-1 rounded-full text-xs font-medium mr-2 transition-colors"
      style={styles}
    >
      {children}
    </span>
  );
}
