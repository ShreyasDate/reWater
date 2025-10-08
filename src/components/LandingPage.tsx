import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import Navigation from './Navigation';
import GlassCard from './GlassCard';
import { Play, Cpu, Database, Shield, Github, Linkedin, Twitter } from 'lucide-react';

interface LandingPageProps {
  onNavigateToDemo: () => void;
}

export default function LandingPage({ onNavigateToDemo }: LandingPageProps) {
  const [statsAnimated, setStatsAnimated] = useState(false);

  const handleInactiveFeature = () => {
    toast("Feature coming soon — prototype only");
  };

  const stats = [
    { label: 'Freshwater Saved', value: 50, suffix: '%' },
    { label: 'Cost Reduction', value: 25, suffix: '%' },
    { label: 'ROI', value: 2, suffix: ' Years', prefix: '1–' },
  ];

  const features = [
    {
      icon: <Cpu className="w-10 h-10" />,
      title: 'AI Process Designer',
      description: 'Auto-selects optimal treatment stages',
      iconBg: 'from-blue-600 to-blue-700',
      accentColor: 'blue'
    },
    {
      icon: <Database className="w-10 h-10" />,
      title: 'Digital Twin Simulation',
      description: 'Predicts quality, cost & reuse outcome',
      iconBg: 'from-violet-600 to-violet-700',
      accentColor: 'violet'
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: 'Verified Ledger',
      description: 'Creates tamper-proof reuse certificates',
      iconBg: 'from-emerald-600 to-emerald-700',
      accentColor: 'emerald'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setStatsAnimated(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation onTryDemo={onNavigateToDemo} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-white glow-text">Recover. Reuse.</span>{' '}
                <span className="text-accent-blue block">
                  Reimagine Water.
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                AI-driven process design, digital-twin simulation, and verified reuse 
                for industrial circularity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  onClick={onNavigateToDemo}
                  className="btn-primary text-white px-10 py-5 rounded-2xl text-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  Try Demo
                </Button>
                <Button
                  onClick={handleInactiveFeature}
                  className="btn-secondary text-white px-10 py-5 rounded-2xl text-lg transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Watch Demo
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                Prototype version — upcoming features will show a toast.
              </p>
            </motion.div>

            {/* 3D Visual Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="relative h-[500px] glass-panel rounded-[32px] p-8 overflow-hidden">
                {/* Central glowing orb */}
                <motion.div
                  className="absolute w-32 h-32 rounded-full"
                  style={{
                    left: '50%',
                    top: '40%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Floating glass panels */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute glass-panel rounded-2xl p-3 animate-float"
                    style={{
                      width: `${80 + Math.random() * 60}px`,
                      height: `${60 + Math.random() * 40}px`,
                      left: `${Math.random() * 70 + 15}%`,
                      top: `${Math.random() * 60 + 20}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      rotateY: [0, 15, 0],
                      rotateX: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-xl"
                      style={{
                        background: i % 3 === 0 
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.1))'
                          : i % 3 === 1
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))'
                          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))'
                      }}
                    />
                  </motion.div>
                ))}
                
                {/* Floating particles */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: i % 2 === 0 ? '#2BC0E4' : '#C77DFF',
                      left: `${Math.random() * 80 + 10}%`,
                      top: '85%',
                    }}
                    animate={{
                      y: [0, -350],
                      opacity: [0.8, 0],
                      scale: [1, 0.3],
                      x: [0, (Math.random() - 0.5) * 50],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.line
                      key={i}
                      x1={`${20 + i * 20}%`}
                      y1="60%"
                      x2={`${40 + i * 20}%`}
                      y2="40%"
                      stroke="url(#gradient)"
                      strokeWidth="1"
                      opacity="0.4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2BC0E4" />
                      <stop offset="100%" stopColor="#8E2DE2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold text-center text-white mb-16 glow-text"
          >
            Key Features
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard onClick={handleInactiveFeature} className="text-center relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className={`mb-6 flex justify-center p-4 rounded-2xl bg-gradient-to-br ${feature.iconBg} text-white w-fit mx-auto border border-white/10`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 font-display">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold text-center text-white mb-16 glow-text"
          >
            Impact Stats
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-panel rounded-[24px] p-8 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-4xl font-bold mb-3 font-display">
                    <span className="text-accent-blue">
                      {stat.prefix || ''}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={statsAnimated ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: index * 0.3 }}
                      >
                        {statsAnimated ? stat.value : 0}
                      </motion.span>
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-gray-400 text-lg">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold text-center text-white mb-16 glow-text"
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-12 items-center">
            {['Upload Data', 'Simulate', 'Generate Certificate'].map((step, index) => (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl font-display animate-glow border border-white/10">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 font-display">{step}</h3>
                  <p className="text-gray-500 text-sm">
                    {index === 0 && "Upload your industrial water treatment data"}
                    {index === 1 && "Run AI-powered digital twin simulation"}
                    {index === 2 && "Get verified reuse certificate"}
                  </p>
                </motion.div>
                
                {index < 2 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.3 + 0.5 }}
                    className="hidden md:block h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 mx-8 rounded-full"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-[20px] p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="space-y-3">
                <h4 className="text-white font-semibold font-display">Quick Links</h4>
                <div className="flex flex-wrap gap-6">
                  {['Research', 'Privacy', 'Contact'].map((link) => (
                    <button
                      key={link}
                      onClick={handleInactiveFeature}
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  © 2025 Team EduBotX+ · All Rights Reserved · Built for Smart India Hackathon 2025
                </p>
              </div>
              
              <div className="flex justify-center md:justify-end gap-4">
                {[
                  { icon: Linkedin, href: '#' },
                  { icon: Github, href: '#' },
                  { icon: Twitter, href: '#' }
                ].map((social, index) => (
                  <button
                    key={index}
                    onClick={handleInactiveFeature}
                    className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:text-blue-400 transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}