import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import LandingPage from './components/LandingPage';
import TryDemoPage from './components/TryDemoPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'demo'>('landing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black relative overflow-x-hidden">
      {/* Professional animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        
        {/* Subtle light sweep */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.02) 50%, transparent 60%)',
            transform: 'translateX(-100%)',
          }}
          animate={{
            transform: ['translateX(-100%)', 'translateX(100%)'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Professional floating orbs */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full animate-orb"
            style={{
              width: `${120 + Math.random() * 80}px`,
              height: `${120 + Math.random() * 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0 ? 'rgba(59, 130, 246, 0.06)' :
                i % 3 === 1 ? 'rgba(139, 92, 246, 0.04)' :
                'rgba(16, 185, 129, 0.03)'
              } 0%, transparent 70%)`,
              filter: 'blur(1px)',
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Large background orbs */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${300 + Math.random() * 200}px`,
              height: `${300 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i === 0 ? 'rgba(59, 130, 246, 0.03)' :
                i === 1 ? 'rgba(139, 92, 246, 0.02)' :
                'rgba(16, 185, 129, 0.02)'
              } 0%, transparent 60%)`,
              filter: 'blur(2px)',
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Minimal particle system */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-blue-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Page content */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        {currentPage === 'landing' ? (
          <LandingPage onNavigateToDemo={() => setCurrentPage('demo')} />
        ) : (
          <TryDemoPage onNavigateToHome={() => setCurrentPage('landing')} />
        )}
      </motion.div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(18, 24, 38, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(24, 211, 200, 0.2)',
            color: '#EAF8F7',
            borderRadius: '20px',
          }
        }}
      />
    </div>
  );
}