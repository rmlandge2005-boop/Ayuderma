import { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeSkin, findNearbyDoctors, generateImage } from './services/geminiService';
import { SkinAnalysis } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ScanFace, History, RefreshCw } from 'lucide-react';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (base64: string) => {
    setImage(base64);
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setDoctors([]);

    try {
      const result = await analyzeSkin(base64);
      
      // Generate AI images for hairstyles using the original photo as reference
      if (result.facialAnalysis?.hairstyles) {
        const hairstylePromises = result.facialAnalysis.hairstyles.map(async (style) => {
          try {
            const prompt = `A professional high-quality portrait photo of the person from the reference image. Apply the following hairstyle: ${style.name}. ${style.description}. Ensure the entire face and the complete hairstyle are clearly visible in a well-framed portrait shot. Maintain the person's original facial features, skin tone, and identity. Studio lighting, clean background. The person has a ${result.facialAnalysis?.faceShape} face shape.`;
            const aiImageUrl = await generateImage(prompt, base64, "3:4");
            return { ...style, imageUrl: aiImageUrl };
          } catch (err) {
            console.error("Failed to generate image for", style.name, err);
            return style; // Fallback to placeholder
          }
        });
        
        const updatedHairstyles = await Promise.all(hairstylePromises);
        result.facialAnalysis.hairstyles = updatedHairstyles;
      }

      setAnalysis(result);

      // If serious or high severity, find nearby doctors
      if (result.isSerious || result.severity === 'high') {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const nearby = await findNearbyDoctors(
                position.coords.latitude,
                position.coords.longitude
              );
              setDoctors(nearby);
            } catch (err) {
              console.error("Failed to find doctors:", err);
            }
          },
          (err) => console.error("Geolocation failed:", err)
        );
      }
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setDoctors([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-accent to-indigo-600 rounded-xl blur-sm opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative w-11 h-11 bg-linear-to-br from-accent to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <ScanFace className="text-white w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">AYUDERMA</span>
              <span className="text-[10px] font-bold text-accent tracking-widest uppercase">AI Skin Intelligence</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {analysis && (
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Scan
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div 
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
                  Understand Your Skin <br />
                  <span className="text-accent">Better Than Ever.</span>
                </h1>
                <p className="text-lg text-slate-500">
                  Upload a photo for instant AI analysis of skin type, conditions, and personalized wellness routines.
                </p>
              </div>

              <ImageUploader onImageSelect={handleImageSelect} isLoading={loading} />

              {error && (
                <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                <FeatureCard 
                  icon={<ScanFace className="w-6 h-6 text-accent" />}
                  title="AI Analysis"
                  description="Advanced vision models detect skin type, pimples, and symmetry."
                />
                <FeatureCard 
                  icon={<Sparkles className="w-6 h-6 text-emerald-500" />}
                  title="Safe Advice"
                  description="Get treatment steps, dos & don'ts, and medication suggestions."
                />
                <FeatureCard 
                  icon={<History className="w-6 h-6 text-blue-500" />}
                  title="Full Routine"
                  description="Personalized dietary and skincare routines based on your results."
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                  <h2 className="text-3xl font-bold">Analysis Results</h2>
                  <p className="text-slate-500">Generated by Ayuderma</p>
                </div>
                <div className="hidden md:block">
                  <div className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-bold">
                    Scan Complete
                  </div>
                </div>
              </div>

              <AnalysisResult data={analysis} doctors={doctors} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
            <span>Ayush Chauhan</span>
            <span>Krishna Borde</span>
            <span>Rishikesh Dhakne</span>
            <span>Ruturaj Landge</span>
          </div>
          <p className="text-slate-400 text-xs">
            © 2026 Ayuderma. For informational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
