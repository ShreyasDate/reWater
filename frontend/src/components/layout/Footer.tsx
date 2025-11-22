import { Droplets, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => (
  <footer className="py-12 border-t border-white/10 bg-background/50 backdrop-blur-md">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Droplets className="text-cyan-500 h-6 w-6" />
        <span className="text-xl font-bold text-foreground">EduBotx</span>
      </div>
      <div className="text-sm text-muted-foreground">
        © 2025 EduBotx. SIH Project ID 25259.
      </div>
      <div className="flex gap-6">
        <Github className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        <Linkedin className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        <Twitter className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
      </div>
    </div>
  </footer>
);