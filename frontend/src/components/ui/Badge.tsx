import React from 'react';

export const Badge = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-500 backdrop-blur-md ${className}`}>
    {children}
  </span>
);