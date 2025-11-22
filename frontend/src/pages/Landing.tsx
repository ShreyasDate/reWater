import { Hero } from '../components/sections/Hero';
import { Features } from '../components/sections/Features';
import { TechStack } from '../components/sections/TechStack';
import { Team } from '../components/sections/Team';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface LandingProps {
  setView: (view: string) => void;
}

export const Landing = ({ setView }: LandingProps) => {
  return (
    <main>
      <Hero setView={setView} />
      <Features />
      <TechStack />
      <Team />
      <section className="py-20 px-6 text-center">
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
          <h2 className="text-4xl font-bold mb-6">Ready to Revolutionize Water Reuse?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join us in our mission to save millions of liters of fresh water daily through intelligent data-driven treatment design.
          </p>
          <Button size="lg" onClick={() => setView('signup')}>Get Started Now</Button>
        </Card>
      </section>
    </main>
  );
};