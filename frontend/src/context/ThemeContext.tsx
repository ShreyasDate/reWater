import React, { createContext, useContext, useEffect } from 'react';

// Theme is now static 'dark', but we keep the context structure 
// in case you want to add other global UI states later.
interface ThemeContextType {
  theme: string;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark' });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  
  useEffect(() => {
    // Force dark mode on mount
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// Replaced ThemeToggle with a null component so existing imports don't break immediately
// You can remove this usage from Navbar later if you want cleaner code.
export const ThemeToggle = () => null;