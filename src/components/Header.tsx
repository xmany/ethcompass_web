'use client';

import dynamic from 'next/dynamic';

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false });

export default function Header() {
  return (
    <header className="sticky top-0 backdrop-blur-lg z-10 p-4 border-b transition-colors"
      style={{ 
        backgroundColor: 'var(--bg-header)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="w-8"></div>
        <h1 className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
          <span className="text-blue-500">🧭</span> 以太坊罗盘
        </h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
