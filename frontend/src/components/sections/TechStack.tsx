import { motion } from 'motion/react';
import { Code2, Server, FlaskConical, Cpu, Lock, LayoutDashboard } from 'lucide-react';

export const TechStack = () => {
  const stack = [
    { name: "React", role: "Frontend", icon: Code2 },
    { name: "Node.js", role: "Backend", icon: Server },
    { name: "Python FastAPI", role: "ML Service", icon: FlaskConical },
    { name: "XGBoost", role: "Algorithm", icon: Cpu },
    { name: "Blockchain", role: "Security", icon: Lock },
    { name: "Tailwind", role: "Styling", icon: LayoutDashboard },
  ];

  return (
    <section id="tech" className="py-20 border-t border-white/5 bg-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Built with Modern Tech</h2>
          <p className="text-muted-foreground">A robust, scalable architecture designed for reliability.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {stack.map((tech, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-background border border-white/10 shadow-lg"
            >
              <div className="p-2 rounded-full bg-cyan-500/10 text-cyan-500">
                <tech.icon size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">{tech.name}</div>
                <div className="text-xs text-muted-foreground">{tech.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};