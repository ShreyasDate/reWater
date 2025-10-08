import React from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hoverable = true, onClick }: GlassCardProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      className={`glass-panel rounded-[20px] p-6 ${hoverable ? 'glass-hover' : ''} ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.05, y: -5 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </Component>
  );
}