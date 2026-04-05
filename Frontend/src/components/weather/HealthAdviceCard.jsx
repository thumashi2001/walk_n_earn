import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getMatchingHealthAdvice } from "../../services/healthService";

export default function HealthAdviceCard() {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatchingHealthAdvice()
      .then(setAdvices)
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="rounded-3xl border border-amber-100/50 bg-gradient-to-br from-amber-50/50 to-white p-8 shadow-lg shadow-amber-900/5 min-h-[200px]">
      <h2 className="text-lg font-bold text-amber-900">Health Advice</h2>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-stone-400 animate-pulse">
            Analyzing conditions...
          </p>
        ) : advices.length > 0 ? (
          <AnimatePresence>
            {advices.map((advice, index) => (
              <motion.div
                key={advice._id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-3 rounded-2xl bg-white/60 shadow-sm ring-1 ring-amber-100"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <span>✨</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    {advice.title}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    {advice.advice}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex items-start gap-4 opacity-60">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-400">
              <span>🍃</span>
            </div>
            <p className="text-sm text-stone-500 italic">
              No specific alerts for today. Enjoy your walk!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
