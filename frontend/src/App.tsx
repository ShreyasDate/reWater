import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { ThemeProvider } from './context/ThemeContext';
import { Background } from './components/layout/Background';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';

// Load Backend URL from environment variables (Vite)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'signin' | 'signup' | 'dashboard'
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(`${BACKEND_URL}/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // If successful, user is authenticated
          setUser(res.data.user);
          // Don't auto-redirect to dashboard here if user wants to see landing, 
          // but usually on refresh, staying on dashboard is preferred.
          // For now, let's stay on 'landing' initially unless we want auto-redirect.
          // EDIT: Let's auto-redirect if token is valid for seamless experience.
          setView('dashboard');
        } catch (error) {
          console.error("Session expired", error);
          localStorage.removeItem("token");
          // Stay on landing or signin? Landing is less intrusive.
          setView('landing'); 
        }
      }
    };
    checkAuth();
  }, []);

  // --- Auth Handlers ---

  const handleSignIn = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/signin`, { email, password });
      
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setView('dashboard');
      toast.success("Welcome back! Signed in successfully.");
      
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong.";
      toast.error(message);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${BACKEND_URL}/signup`, { name, email, password });
      
      toast.success("Account created! Please sign in.");
      setView('signin');
      
    } catch (error: any) {
      const message = error.response?.data?.message || "Signup failed.";
      toast.error(message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setView('landing');
    toast.info("Logged out successfully.");
  };

  // Wrapper to protect dashboard route
  const handleSetView = (newView: string) => {
    if (newView === 'dashboard' && !user) {
      toast.warning("Please sign in to access the dashboard.");
      setView('signin');
    } else {
      setView(newView);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen text-foreground overflow-x-hidden font-sans selection:bg-cyan-500/30 flex flex-col">
        <Background />
        
        <Navbar 
          setView={handleSetView} 
          currentView={view} 
          isLoggedIn={!!user} 
          onLogout={handleLogout}
        />
        
        <div className="grow">
          {view === 'landing' && <Landing setView={handleSetView} />}
          
          {view === 'signin' && (
            <SignIn 
              setView={handleSetView} 
              onSignIn={handleSignIn} 
            />
          )}
          
          {view === 'signup' && (
            <SignUp 
              setView={handleSetView} 
              onSignUp={handleSignUp} 
            />
          )}

          {view === 'dashboard' && user && (
            <Dashboard user={user} />
          )}
        </div>

        <Footer />
        <Toaster position="top-center" richColors />
      </div>
    </ThemeProvider>
  );
}