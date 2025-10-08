import React, { useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import Navigation from './Navigation';
import GlassCard from './GlassCard';
import { ChevronDown, Play, FileCheck, Droplets, Activity, Zap, TrendingUp } from 'lucide-react';

interface TryDemoPageProps {
  onNavigateToHome: () => void;
}

export default function TryDemoPage({ onNavigateToHome }: TryDemoPageProps) {
  const [selectedPlant, setSelectedPlant] = useState('plant-a');
  const [selectedScenario, setSelectedScenario] = useState('baseline');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const handleInactiveFeature = () => {
    toast("Feature coming soon — prototype only");
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
      toast("Simulation completed — results are simulated");
    }, 2000);
  };

  const handleCertificateClick = () => {
    toast("Certificate simulated — ledger demo only");
  };

  const kpiData = [
    { label: 'BOD', value: '120', unit: 'mg/L', icon: <Droplets className="w-6 h-6" />, gradient: 'from-blue-600 to-blue-700' },
    { label: 'COD', value: '260', unit: 'mg/L', icon: <Activity className="w-6 h-6" />, gradient: 'from-violet-600 to-violet-700' },
    { label: 'TSS', value: '35', unit: 'mg/L', icon: <TrendingUp className="w-6 h-6" />, gradient: 'from-emerald-600 to-emerald-700' },
    { label: 'Flow', value: '22', unit: 'm³/hr', icon: <Zap className="w-6 h-6" />, gradient: 'from-indigo-600 to-indigo-700' },
  ];

  const resultMetrics = [
    { label: 'Effluent Quality', value: '98.2%', color: 'text-blue-400' },
    { label: 'Water Recovery', value: '47%', color: 'text-violet-400' },
    { label: 'Energy Use', value: '↓ 18%', color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen">
      <Navigation showBackButton onBack={onNavigateToHome} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold text-center mb-16 glow-text"
          >
            <span className="text-accent-blue">ReWater+</span>{' '}
            <span className="text-white">Demo Dashboard</span>
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <GlassCard hoverable={false}>
                <h2 className="font-display text-2xl font-semibold text-white mb-6">Live Plant Dashboard</h2>
                
                {/* Plant Selection */}
                <div className="mb-6">
                  <label className="block text-white/80 mb-3 font-medium">Select Sample Plant</label>
                  <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                    <SelectTrigger className="glass-panel border-white/20 text-white rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/20 rounded-xl">
                      <SelectItem value="plant-a">Plant A - Textile Manufacturing</SelectItem>
                      <SelectItem value="plant-b">Plant B - Chemical Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* KPI Tiles */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {kpiData.map((kpi, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="glass-panel rounded-2xl p-6 text-center relative overflow-hidden group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="relative z-10">
                        <div className={`flex items-center justify-center mb-3 text-white p-3 rounded-xl bg-gradient-to-br ${kpi.gradient} w-fit mx-auto`}>
                          {kpi.icon}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1 font-display">{kpi.value}</div>
                        <div className="text-sm text-white/70 font-medium">{kpi.label}</div>
                        <div className="text-xs text-white/50">{kpi.unit}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Reuse Class */}
                <div className="glass-panel rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8E2DE2]/10 to-[#4A00E0]/5" />
                  <div className="relative z-10">
                    <div className="text-sm text-white/70 mb-2 font-medium">Reuse Class</div>
                    <div className="text-xl font-semibold text-gradient-secondary font-display">Industrial Cooling</div>
                  </div>
                </div>
              </GlassCard>

              {/* Forecast Chart */}
              <GlassCard hoverable={false}>
                <h3 className="font-display text-xl font-semibold text-white mb-6">
                  Predicted Water Quality (Next 24h)
                </h3>
                <div className="h-40 glass-panel rounded-2xl p-6 relative overflow-hidden">
                  {/* Chart background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2BC0E4]/5 to-[#8E2DE2]/5" />
                  {/* Animated chart line */}
                  <svg className="w-full h-full relative z-10">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2BC0E4" />
                        <stop offset="100%" stopColor="#8E2DE2" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2BC0E4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8E2DE2" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M 10 80 Q 80 40 160 50 T 320 45 T 500 55"
                      stroke="url(#chartGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </GlassCard>

              {/* Recommendation Card */}
              <GlassCard hoverable={false}>
                <h3 className="font-display text-xl font-semibold text-white mb-4">AI Recommendations</h3>
                <div className="glass-panel rounded-xl p-4 mb-6 bg-gradient-to-r from-blue-500/10 to-violet-500/5">
                  <p className="text-gray-200 text-center font-medium">
                    "Reduce coagulant dose by 12% · Increase aeration by 8%"
                  </p>
                </div>
                <Button
                  onClick={handleInactiveFeature}
                  variant="outline"
                  className="w-full glass-panel border-white/30 text-white hover:bg-white/10 rounded-xl py-3 transition-all duration-300 hover:scale-105"
                >
                  Apply Recommendations
                </Button>
              </GlassCard>

              {/* Run Simulation */}
              <GlassCard hoverable={false}>
                <Button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full btn-primary text-white py-4 rounded-2xl font-medium text-lg transition-all duration-300 hover:scale-105"
                >
                  {isSimulating ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running Simulation...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Play className="w-6 h-6" />
                      Run Simulation
                    </div>
                  )}
                </Button>
                {isSimulating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                  >
                    <Progress value={75} className="w-full h-2" />
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>

            {/* Right Column - Digital Twin & Results */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Scenario Selection */}
              <GlassCard hoverable={false}>
                <h2 className="font-display text-2xl font-semibold text-white mb-8">Digital Twin Simulation</h2>
                
                <div className="mb-8">
                  <label className="block text-white/80 mb-3 font-medium">Scenario</label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger className="glass-panel border-white/20 text-white rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/20 rounded-xl">
                      <SelectItem value="baseline">Baseline Operation</SelectItem>
                      <SelectItem value="high-load">+20% Load Increase</SelectItem>
                      <SelectItem value="fouling">Membrane Fouling Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Animated Twin Schematic */}
                <div className="h-48 glass-panel rounded-lg p-4 relative overflow-hidden mb-6">
                  <div className="text-center text-[#EAF8F7]/70 mb-4">Treatment Process Flow</div>
                  
                  {/* Tanks */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-16 h-12 glass-panel rounded-lg"
                      style={{ left: `${20 + i * 25}%`, top: '50%', transform: 'translateY(-50%)' }}
                      animate={{
                        boxShadow: [
                          '0 0 10px rgba(24,211,200,0.3)',
                          '0 0 20px rgba(24,211,200,0.6)',
                          '0 0 10px rgba(24,211,200,0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-[#18D3C8]/20 to-[#6C5CE7]/20 rounded-lg" />
                    </motion.div>
                  ))}
                  
                  {/* Flowing liquid animation */}
                  {[0, 1].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute h-1 bg-gradient-to-r from-[#18D3C8] to-[#6C5CE7] rounded-full"
                      style={{ 
                        width: '15%', 
                        left: `${35 + i * 25}%`, 
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scaleX: [0.8, 1.2, 0.8]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>
              </GlassCard>

              {/* Results */}
              {simulationComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <GlassCard hoverable={false}>
                    <h3 className="text-lg font-semibold text-[#EAF8F7] mb-4">Simulation Results</h3>
                    
                    <div className="grid gap-4">
                      {resultMetrics.map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="flex justify-between items-center p-3 glass-panel rounded-lg"
                        >
                          <span className="text-[#EAF8F7]/80">{metric.label}</span>
                          <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Certificate Card */}
                  <GlassCard onClick={handleCertificateClick}>
                    <div className="text-center">
                      <FileCheck className="w-12 h-12 text-[#18D3C8] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[#EAF8F7] mb-2">
                        Reuse Certificate Generated
                      </h3>
                      <p className="text-[#EAF8F7]/80 mb-2">
                        Plant A – 1,500 KL Verified Reuse Volume
                      </p>
                      <p className="text-sm text-[#18D3C8] mb-4">
                        Certificate ID: #RW-8F21A9
                      </p>
                      <div className="text-xs text-[#EAF8F7]/50">
                        Click to view certificate details
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#18D3C8]/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[12px] text-[#EAF8F7]/60 glow-text-sm">
            © 2025 Team ReWater+ · All Rights Reserved · Built for Smart India Hackathon 2025
          </p>
        </div>
      </footer>
    </div>
  );
}