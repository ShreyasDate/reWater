import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface SignUpProps {
  setView: (view: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

export const SignUp = ({ setView, onSignUp }: SignUpProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) return;
    setIsLoading(true);
    await onSignUp(name, email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-20">
      <Card className="w-full max-w-md p-8 mx-4 border-cyan-500/20">
         <button onClick={() => setView('landing')} className="mb-6 text-sm text-muted-foreground hover:text-cyan-500 flex items-center gap-1 cursor-pointer">
           ← Back to Home
        </button>
        <h2 className="text-3xl font-bold mb-2 text-center">Join EduBotx</h2>
        <p className="text-center text-muted-foreground mb-8">Start optimizing water resources today</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">Full Name</label>
            <input 
              className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-foreground" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">Email</label>
            <input 
              className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-foreground" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">Password</label>
            <input 
              type="password" 
              className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-foreground" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full mt-2" onClick={handleSubmit}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </Card>
    </div>
  );
};