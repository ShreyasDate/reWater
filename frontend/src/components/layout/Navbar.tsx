import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  setView: (view: string) => void;
  currentView?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar = ({ setView, currentView = 'landing', isLoggedIn = false, onLogout }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solution', href: '#solution' },
    { name: 'Features', href: '#features' },
    { name: 'Tech Stack', href: '#tech' },
    { name: 'Team', href: '#team' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (currentView !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const element = document.querySelector(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Hide landing nav links if on auth pages OR dashboard
  const hideNavLinks = currentView === 'signin' || currentView === 'signup' || isLoggedIn;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 glass border-b border-white/5 shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300 border border-white/10">
            <Droplets className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-500 to-blue-500 drop-shadow-sm">
            EduBotx
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!hideNavLinks && navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-cyan-400 transition-colors relative group cursor-pointer"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500/50 blur-sm transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          
          {/* Logic for Auth Buttons */}
          {isLoggedIn ? (
            <>
              {/* Show Dashboard button if logged in but currently on Landing Page */}
              {currentView === 'landing' && (
                <Button variant="primary" size="sm" onClick={() => setView('dashboard')} icon={LayoutDashboard}>
                  Dashboard
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={onLogout} icon={LogOut}>Logout</Button>
            </>
          ) : (
            <>
              {currentView === 'landing' && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setView('signin')}>Sign In</Button>
                  <Button variant="primary" size="sm" onClick={() => setView('signup')}>Get Started</Button>
                </>
              )}

              {currentView === 'signin' && (
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">New here?</span>
                  <Button variant="primary" size="sm" onClick={() => setView('signup')}>Sign Up</Button>
                </div>
              )}

              {currentView === 'signup' && (
                <div className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Already have an account?</span>
                  <Button variant="ghost" size="sm" onClick={() => setView('signin')}>Sign In</Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground p-2 cursor-pointer hover:bg-white/10 rounded-lg transition-colors">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {!hideNavLinks && navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-lg font-medium text-foreground/80 hover:text-cyan-400"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="h-px bg-white/10 my-2" />
              
              {isLoggedIn ? (
                <>
                  <Button variant="primary" className="w-full" onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }}>Dashboard</Button>
                  <Button variant="secondary" className="w-full" onClick={onLogout}>Logout</Button>
                </>
              ) : (
                <>
                  {currentView === 'landing' && (
                    <>
                      <Button variant="secondary" className="w-full" onClick={() => { setView('signin'); setIsMobileMenuOpen(false); }}>Sign In</Button>
                      <Button variant="primary" className="w-full" onClick={() => { setView('signup'); setIsMobileMenuOpen(false); }}>Get Started</Button>
                    </>
                  )}

                  {currentView === 'signin' && (
                    <Button variant="primary" className="w-full" onClick={() => { setView('signup'); setIsMobileMenuOpen(false); }}>Sign Up</Button>
                  )}

                  {currentView === 'signup' && (
                    <Button variant="secondary" className="w-full" onClick={() => { setView('signin'); setIsMobileMenuOpen(false); }}>Sign In</Button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};