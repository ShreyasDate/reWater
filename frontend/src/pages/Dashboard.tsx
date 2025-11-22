import { Card } from '../components/ui/Card';

interface DashboardProps {
  user: { name: string; email: string };
}

export const Dashboard = ({ user }: DashboardProps) => {
  return (
    <div className="min-h-screen pt-32 px-6 container mx-auto">
      <Card className="p-12 text-center border-cyan-500/30 bg-linear-to-b from-white/5 to-transparent">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500">
          Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Welcome back, <span className="text-foreground font-medium">{user.name}</span>!
        </p>
        <div className="mt-8 p-6 border border-dashed border-white/10 rounded-xl bg-black/20">
          <p className="text-sm text-muted-foreground">
            Simulation modules and prediction analytics will appear here.
          </p>
        </div>
      </Card>
    </div>
  );
};