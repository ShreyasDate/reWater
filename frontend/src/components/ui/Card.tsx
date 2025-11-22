import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div 
    className={`
      rounded-2xl 
      glass-card
      transition-all 
      duration-300 
      hover:scale-[1.02]
      hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]
      hover:border-white/20
      overflow-hidden 
      relative
      group
      ${className}
    `}
  >
    {/* Subtle inner gradient reflection on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    {children}
  </div>
);