import React from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface NavigationProps {
  onTryDemo?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Navigation({ onTryDemo, showBackButton, onBack }: NavigationProps) {
  const handleInactiveLink = () => {
    toast("Feature coming soon — prototype only");
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 p-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-[20px] px-6 py-4 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-8">
            {showBackButton ? (
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:text-blue-400 hover:bg-white/5 transition-all duration-300"
              >
                ← Back to Home
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center animate-glow border border-white/10">
                  <span className="text-white font-bold text-lg">R+</span>
                </div>
                <span className="font-display text-xl font-semibold text-white">ReWater+</span>
              </div>
            )}
          </div>

          {/* Center links */}
          {!showBackButton && (
            <div className="hidden md:flex items-center gap-6">
              {['Home', 'How It Works', 'Research', 'Contact'].map((link) => (
                <button
                  key={link}
                  onClick={handleInactiveLink}
                  className="text-white/70 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5 relative group"
                >
                  {link}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </button>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {!showBackButton ? (
              <Button
                onClick={onTryDemo}
                className="btn-primary text-white px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 font-medium"
              >
                Try Demo
              </Button>
            ) : (
              <Button
                onClick={handleInactiveLink}
                className="btn-primary text-white px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 font-medium"
              >
                Run Simulation
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}