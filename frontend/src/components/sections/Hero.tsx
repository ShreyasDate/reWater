import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowRight, Activity, Cpu, Github, CheckCircle2, Droplets } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface HeroProps {
  setView: (view: string) => void;
}

export const Hero = ({ setView }: HeroProps) => {
  // Explicitly type these as 'Variants' to fix the easing type error
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center"
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-6 hover:scale-105 transition-transform cursor-default">
              SIH 2025 • PSID 25259
            </Badge>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Recover. Reuse. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">
              Reimagine Water.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
            A smart simulation-based wastewater treatment & reuse prediction system. 
            We use Digital Twins and AI to optimize water recovery for a sustainable future.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" onClick={() => setView('signup')} icon={ArrowRight}>
              Explore Dashboard
            </Button>
            <Button variant="secondary" size="lg" icon={Github}>
              View Solution
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 flex flex-wrap items-center gap-6 text-muted-foreground">
            {['AI Optimization', 'Digital Twin', 'Blockchain Secure'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="bg-cyan-500/10 p-1 rounded-full">
                  <CheckCircle2 className="text-cyan-500 h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[500px] w-full hidden lg:flex items-center justify-center perspective-1000"
        >
          <motion.div 
            animate={{ y: [-15, 15, -15], rotateX: [5, -5, 5], rotateY: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 z-30"
          >
            <Card className="p-4 w-64 bg-background/60 border-cyan-500/30 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><Activity size={18} /></div>
                <div className="text-sm font-semibold text-foreground">Influent BOD</div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">245 mg/L</div>
              <div className="text-xs text-cyan-500 font-medium">+12% vs Predicted</div>
            </Card>
          </motion.div>

           <motion.div 
            animate={{ y: [20, -20, 20], rotateX: [-5, 5, -5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-10 z-30"
          >
            <Card className="p-4 w-72 bg-background/60 border-blue-500/30 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Cpu size={18} /></div>
                <div className="text-sm font-semibold text-foreground">Simulation Engine</div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full w-[75%] bg-blue-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xs text-blue-400 flex justify-between font-medium">
                <span>Optimizing...</span>
                <span>75%</span>
              </div>
            </Card>
          </motion.div>

          <div className="relative w-96 h-96 group cursor-pointer">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl animate-pulse-slow group-hover:blur-[100px] transition-all duration-500" />
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-12 rounded-full border border-blue-500/30"
            />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-b from-cyan-500 to-blue-600 opacity-90 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-500">
                  <Droplets className="text-white h-20 w-20 drop-shadow-lg animate-bounce" />
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};