import { motion } from 'motion/react';
import { Linkedin, Twitter } from 'lucide-react';
import { Card } from '../ui/Card';

export const Team = () => {
  const team = [
    { name: "Vinit", role: "ML Model & Preprocessing", color: "from-blue-500 to-cyan-500" },
    { name: "Sumit", role: "ML Model & Dataset", color: "from-cyan-500 to-teal-500" },
    { name: "Aditi", role: "UI/UX Design", color: "from-pink-500 to-rose-500" },
    { name: "Shreyas", role: "React + Node.js Dev", color: "from-indigo-500 to-purple-500" },
    { name: "Sarah", role: "Blockchain & Security", color: "from-amber-500 to-orange-500" },
    { name: "Pratham", role: "Planning & Presentation", color: "from-emerald-500 to-green-500" },
  ];

  return (
    <section id="team" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Meet Team EduBotx</h2>
          <p className="text-muted-foreground">The minds behind the innovation.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${member.color} blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`} />
              <Card className="p-6 flex items-center gap-4 hover:border-white/20 transition-colors relative z-10">
                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {member.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-cyan-500">{member.role}</p>
                  <div className="flex gap-2 mt-2">
                    <Linkedin size={14} className="text-muted-foreground hover:text-foreground cursor-pointer" />
                    <Twitter size={14} className="text-muted-foreground hover:text-foreground cursor-pointer" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};