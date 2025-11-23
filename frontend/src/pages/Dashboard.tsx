import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Timer, 
  FlaskConical, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3 
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardProps {
  user: { name: string; email: string };
}

// Load ML API URL from environment variables
const ML_API_URL = import.meta.env.VITE_ML_API_URL || "http://localhost:8000";

// Initial form state matches the Python ML input schema
const initialFormData = {
  flow_rate: 500,
  influent_BOD: 250,
  influent_COD: 600,
  influent_TSS: 300,
  influent_pH: 7.2,
  influent_TDS: 800,
  aeration_rate: 2.5,
  chemical_dose: 15,
  sludge_recycle_rate: 0.5,
  retention_time: 6.0,
  temperature: 25.0,
  effluent_BOD_lag1: 20.0
};

// Types for API response
interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Call Python ML API
  const handlePredict = async () => {
    setLoading(true);
    setResult(null); // Reset previous result
    try {
      // Use the environment variable for the API URL
      const response = await axios.post(`${ML_API_URL}/predict`, formData);
      setResult(response.data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Prediction failed:", error);
      toast.error("Failed to connect to AI Model. Is the Python service running?");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get color based on reusability class
  const getResultColor = (prediction: string) => {
    const p = prediction.toLowerCase();
    if (p.includes('drinking') || p.includes('fresh')) return 'text-green-400 border-green-500/50 bg-green-500/10';
    if (p.includes('irrigation')) return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
    if (p.includes('industrial')) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
    return 'text-red-400 border-red-500/50 bg-red-500/10';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 container mx-auto">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Wastewater Simulation Engine
        </h1>
        <p className="text-muted-foreground">
          Operator: <span className="text-cyan-400 font-medium">{user.name}</span> | 
          Status: <span className="text-green-400">System Online</span>
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-cyan-400" />
              <h2 className="text-xl font-semibold">Operational Parameters</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Group 1: Influent Characteristics */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Influent Quality</h3>
                <InputField label="Influent BOD (mg/L)" name="influent_BOD" value={formData.influent_BOD} onChange={handleChange} />
                <InputField label="Influent COD (mg/L)" name="influent_COD" value={formData.influent_COD} onChange={handleChange} />
                <InputField label="Influent TSS (mg/L)" name="influent_TSS" value={formData.influent_TSS} onChange={handleChange} />
                <InputField label="Influent pH" name="influent_pH" value={formData.influent_pH} step="0.1" onChange={handleChange} />
                <InputField label="Influent TDS (mg/L)" name="influent_TDS" value={formData.influent_TDS} onChange={handleChange} />
              </div>

              {/* Group 2: Process Parameters */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Process Control</h3>
                <InputField label="Flow Rate (m3/h)" name="flow_rate" value={formData.flow_rate} onChange={handleChange} icon={Droplets} />
                <InputField label="Aeration Rate (m3/h)" name="aeration_rate" value={formData.aeration_rate} step="0.1" onChange={handleChange} />
                <InputField label="Chemical Dose (mg/L)" name="chemical_dose" value={formData.chemical_dose} onChange={handleChange} icon={FlaskConical} />
                <InputField label="Sludge Recycle Rate" name="sludge_recycle_rate" value={formData.sludge_recycle_rate} step="0.01" onChange={handleChange} />
                <InputField label="Retention Time (hrs)" name="retention_time" value={formData.retention_time} step="0.1" onChange={handleChange} icon={Timer} />
                <InputField label="Temperature (°C)" name="temperature" value={formData.temperature} step="0.1" onChange={handleChange} icon={Thermometer} />
                <InputField label="Effluent BOD Lag (mg/L)" name="effluent_BOD_lag1" value={formData.effluent_BOD_lag1} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handlePredict}
                className="w-full sm:w-auto"
              >
                {loading ? "Analyzing..." : "Run Simulation"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Prediction Card */}
          <AnimatePresence mode='wait'>
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className={`p-6 border-2 ${getResultColor(result.prediction)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="font-semibold uppercase tracking-wide text-sm">AI Prediction</h3>
                  </div>
                  <div className="text-3xl font-bold mb-1 capitalize">
                    {result.prediction.replace('_', ' ')}
                  </div>
                  <div className="text-sm opacity-80 mb-6">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </div>

                  {/* Probability Bars */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      <BarChart3 className="h-3 w-3" /> Class Probabilities
                    </div>
                    {Object.entries(result.probabilities)
                      .sort(([,a], [,b]) => b - a) // Sort by prob desc
                      .slice(0, 4) // Show top 4
                      .map(([label, prob]) => (
                      <div key={label} className="group">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize">{label.replace('_', ' ')}</span>
                          <span className="text-muted-foreground">{(prob * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${prob * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${prob > 0.5 ? 'bg-cyan-500' : 'bg-cyan-500/50'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="placeholder">
                <Card className="p-8 border-white/5 bg-white/5 border-dashed flex flex-col items-center justify-center text-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse-slow">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to Simulate</h3>
                  <p className="text-muted-foreground text-sm max-w-[200px]">
                    Enter the plant parameters on the left and click "Run Simulation" to see AI predictions.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Card */}
          <Card className="p-6 border-cyan-500/20 bg-linear-to-br from-cyan-900/20 to-transparent">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-cyan-400 text-sm mb-1">System Note</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This AI model uses XGBoost to analyze 14 operational parameters. 
                  Results are for simulation guidance only. Always verify with physical lab tests before discharge.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Helper Component for cleaner inputs
const InputField = ({ label, name, value, onChange, type = "number", step = "1", icon: Icon }: any) => (
  <div className="group">
    <label className="block text-xs font-medium text-muted-foreground mb-1.5 group-hover:text-cyan-400 transition-colors">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all pl-3"
      />
      {Icon && (
        <Icon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
      )}
    </div>
  </div>
);