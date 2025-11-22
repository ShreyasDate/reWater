import { motion } from 'motion/react';
import { Cpu, LayoutDashboard, ShieldCheck, Activity, Zap, Database } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const Features = () => {
  const features = [
    {
      title: "AI Process Designer",
      desc: "Intelligent selection of treatment trains based on influent parameters and reuse goals using XGBoost.",
      icon: Cpu,
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
    {
      title: "Digital Twin Engine",
      desc: "Simulate water quality, cost, and energy outcomes before physical implementation.",
      icon: LayoutDashboard,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      title: "Blockchain Ledger",
      desc: "Secure, immutable storage for water quality logs and reuse certificates using Hyperledger concepts.",
      icon: ShieldCheck,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10"
    },
    {
      title: "Predictive Analytics",
      desc: "Real-time forecasting of BOD, COD, and TSS levels to prevent compliance failures.",
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    {
      title: "Adaptive Optimizer",
      desc: "Dynamic adjustment of chemical dosing and aeration rates to reduce operational costs.",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10"
    },
    {
      title: "Reuse Classification",
      desc: "Auto-classify effluent for Irrigation, Industrial Cooling, or Construction based on quality.",
      icon: Database,
      color: "text-pink-400",
      bg: "bg-pink-500/10"
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge className="mb-4">Core Technology</Badge>
          <h2 className="text-4xl font-bold mb-6">Smart Water Management</h2>
          <p className="text-muted-foreground text-lg">
            EduBotx integrates advanced ML algorithms with simulation models to revolutionize how industries treat and reuse wastewater.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full p-8 hover:border-cyan-500/50 transition-colors duration-300">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};