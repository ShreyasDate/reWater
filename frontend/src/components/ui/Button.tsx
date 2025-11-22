import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, icon: Icon }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-white/10 hover:border-white/20",
    secondary: "bg-white/5 hover:bg-white/10 text-foreground backdrop-blur-md border border-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
    ghost: "hover:bg-white/5 hover:text-cyan-400 text-muted-foreground transition-colors",
    outline: "border border-white/10 bg-transparent hover:bg-white/5 hover:text-cyan-400 hover:border-cyan-500/30"
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-8 text-sm",
    lg: "h-14 px-10 text-base",
    icon: "h-10 w-10"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {/* Shine effect on hover for primary buttons */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
      
      <span className="relative flex items-center">
        {children}
        {Icon && <Icon className="ml-2 h-4 w-4" />}
      </span>
    </motion.button>
  );
};