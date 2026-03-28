import { SkinAnalysis } from '../types';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Droplets, 
  ShieldCheck, 
  Apple, 
  Sparkles, 
  Clock,
  Stethoscope,
  X,
  User,
  Activity,
  Scissors,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalysisResultProps {
  data: SkinAnalysis;
  doctors: any[];
}

export function AnalysisResult({ data, doctors }: AnalysisResultProps) {
  const severityColors = {
    low: 'text-green-600 bg-green-50 border-green-100',
    medium: 'text-amber-600 bg-amber-50 border-amber-100',
    high: 'text-red-600 bg-red-50 border-red-100'
  };

  const facial = data.facialAnalysis;

  return (
    <div className="space-y-12 pb-20">
      {/* Header Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="card flex flex-col items-center text-center gap-2">
          <Droplets className="w-8 h-8 text-accent" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Skin Type</span>
          <span className="text-xl font-bold capitalize">{data.skinType}</span>
        </div>
        <div className="card flex flex-col items-center text-center gap-2">
          <User className="w-8 h-8 text-indigo-500" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Face Shape</span>
          <span className="text-xl font-bold capitalize">{facial?.faceShape}</span>
        </div>
        <div className="card flex flex-col items-center text-center gap-2">
          <Scale className="w-8 h-8 text-orange-500" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Symmetry</span>
          <span className="text-xl font-bold capitalize">{facial?.symmetryPercentage}%</span>
        </div>
        <div className={cn("card flex flex-col items-center text-center gap-2 border", severityColors[data.severity])}>
          <AlertCircle className="w-8 h-8" />
          <span className="text-xs uppercase tracking-widest opacity-70 font-bold">Severity</span>
          <span className="text-xl font-bold capitalize">{data.severity}</span>
        </div>
      </motion.div>

      {/* Facial Aesthetics Section */}
      {facial && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">Facial Aesthetics</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Symmetry & Fat */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card space-y-6 lg:col-span-1"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent" />
                  Symmetry Analysis
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{facial.symmetryAnalysis}</p>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Correction Methods</span>
                  <ul className="space-y-1">
                    {facial.correctionMethods.map((m, i) => (
                      <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Face Fat: {facial.faceFatPercentage}%
                </h3>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reduction Tips</span>
                  <ul className="space-y-1">
                    {facial.fatReductionTips.map((t, i) => (
                      <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-orange-400" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Exercises */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card space-y-6 lg:col-span-1"
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                Facial Exercises
              </h3>
              <div className="space-y-4">
                {facial.facialExercises.map((ex, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl space-y-1">
                    <span className="text-sm font-bold text-slate-800">{ex.name}</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{ex.instructions}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hairstyles */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card space-y-6 lg:col-span-1"
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Scissors className="w-5 h-5 text-indigo-500" />
                Hairstyle Suggestions
              </h3>
              <div className="space-y-4">
                {facial.hairstyles.map((style, i) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100">
                    <img 
                      src={style.imageUrl} 
                      alt={style.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                      <span className="text-white font-bold text-sm">{style.name}</span>
                      <p className="text-white/70 text-[10px] line-clamp-2">{style.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">Dermatological Analysis</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-6"
        >
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Info className="w-6 h-6 text-accent" />
            Visual Analysis
          </h3>
          <div className="space-y-4">
            {Object.entries(data.analysis).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs uppercase font-bold text-slate-400">{key.replace('_', ' & ')}</span>
                <p className="text-slate-700 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card space-y-6"
        >
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Treatment & Routine
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-700 italic">"{data.recommendations.treatment}"</p>
            </div>
            
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Daily Routine
              </span>
              <ul className="space-y-2">
                {data.recommendations.routine.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RecommendationCard 
          title="Dos" 
          items={data.recommendations.dos} 
          icon={<CheckCircle2 className="text-emerald-500" />} 
          delay={0.3}
        />
        <RecommendationCard 
          title="Don'ts" 
          items={data.recommendations.donts} 
          icon={<X className="text-red-500" />} 
          delay={0.4}
        />
        <RecommendationCard 
          title="Natural" 
          items={data.recommendations.naturalAlternatives} 
          icon={<Droplets className="text-blue-500" />} 
          delay={0.5}
        />
        <RecommendationCard 
          title="Generic Products" 
          items={data.recommendations.products} 
          icon={<Sparkles className="text-slate-400" />} 
          delay={0.6}
        />
      </div>

      {/* Branded Products Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="card space-y-6"
      >
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          Recommended Branded Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.recommendations.brandedProducts.map((product, i) => (
            <div key={i} className="p-4 rounded-2xl border border-border bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-black text-accent tracking-tighter">{product.brand}</span>
                <h4 className="font-bold text-slate-800 group-hover:text-accent transition-colors">{product.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{product.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Diet & Medication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-emerald-50/50 border-emerald-100"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-800">
            <Apple className="w-6 h-6" /> Dietary Changes
          </h3>
          <ul className="space-y-2">
            {data.recommendations.dietaryChanges.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-emerald-700 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card bg-blue-50/50 border-blue-100"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800">
            <Info className="w-6 h-6" /> Suggested Medication
          </h3>
          <ul className="space-y-2">
            {data.recommendations.medications.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-blue-700 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[10px] text-blue-400 italic">
            * Disclaimer: These are temporary suggestions. Always consult a professional before starting any medication.
          </p>
        </motion.div>
      </div>

      {/* Serious Condition / Nearby Doctors */}
      {(data.isSerious || doctors.length > 0) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-red-200 bg-red-50/30 space-y-6"
        >
          <div className="flex items-center gap-4 text-red-600">
            <Stethoscope className="w-10 h-10" />
            <div>
              <h3 className="text-2xl font-bold">Recommended Doctor Visit</h3>
              <p className="text-red-500/80">Based on the analysis, we suggest consulting a dermatologist.</p>
            </div>
          </div>

          {doctors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((chunk: any, i: number) => (
                <a 
                  key={i}
                  href={chunk.maps?.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-red-100 flex flex-col gap-1"
                >
                  <span className="font-bold text-slate-800">{chunk.maps?.title}</span>
                  <span className="text-xs text-slate-500 line-clamp-1">View on Google Maps</span>
                </a>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function RecommendationCard({ title, items, icon, delay }: { title: string, items: string[], icon: React.ReactNode, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card flex flex-col gap-4"
    >
      <div className="flex items-center gap-2 font-bold text-slate-800">
        {icon}
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
