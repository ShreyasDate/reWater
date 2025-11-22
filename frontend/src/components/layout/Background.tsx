export const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background transition-colors duration-500 pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px] animate-pulse-slow" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[120px] animate-pulse-slow delay-1000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[120px] animate-pulse-slow delay-2000" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
    </div>
  );
};