import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMatchingHealthAdvice } from "../../services/healthService";

export default function HealthAdviceCard() {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatchingHealthAdvice()
      .then(setAdvices)
      .catch((err) => console.error("Advice Fetch Error:", err.message))
      .finally(() => setLoading(false));
  }, []);

  // Helper to get icons based on the Category from your Schema
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Temperature": return "🌡️";
      case "Rain / Storm": return "🌧️";
      case "Wind": return "🌬️";
      case "Humidity": return "💧";
      default: return "✨";
    }
  };

  return (
    <section className="rounded-3xl border border-amber-100/50 bg-gradient-to-br from-amber-50/50 to-white p-8 shadow-lg shadow-amber-900/5 min-h-[200px]">
      <h2 className="text-lg font-bold text-amber-900">Health Advice</h2>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex flex-col gap-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-stone-100" />
          </div>
        ) : advices.length > 0 ? (
          <AnimatePresence>
            {advices.map((advice, index) => (
              <motion.div
                key={advice._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                // Dynamic styling based on Severity
                className={`flex items-start gap-4 p-4 rounded-2xl bg-white/70 shadow-sm ring-1 transition-all
                  ${advice.severity === "Caution" || advice.severity === "Moderate" 
                    ? "ring-amber-300 bg-amber-50/40" 
                    : "ring-stone-100"}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm
                  ${advice.priority === 1 ? "bg-amber-100 text-amber-600" : "bg-stone-50 text-stone-500"}`}>
                  <span className="text-xl">{getCategoryIcon(advice.category)}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-stone-800">
                      {advice.title}
                    </p>
                    {/* Severity Badge */}
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border
                      ${advice.severity === "Caution" || advice.severity === "Moderate"
                        ? "bg-amber-100 border-amber-200 text-amber-700"
                        : "bg-stone-50 border-stone-200 text-stone-500"}`}>
                      {advice.severity}
                    </span>
                  </div>
                  
                  {/* Corrected field name from Schema: advice.advice */}
                  <p className="text-xs text-stone-600 leading-relaxed mt-1.5">
                    {advice.advice}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex items-start gap-4 opacity-60 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-400 ring-1 ring-stone-100">
              <span>🍃</span>
            </div>
            <p className="text-sm text-stone-500 italic mt-1">
              No specific alerts for today. Enjoy your walk!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}