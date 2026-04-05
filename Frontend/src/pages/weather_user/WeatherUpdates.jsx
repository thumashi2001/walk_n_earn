import { motion } from "framer-motion";

export default function WeatherUpdates() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/98 via-white/95 to-amber-50/30 px-5 py-7 shadow-xl shadow-stone-300/25 backdrop-blur-sm sm:px-8 sm:py-9">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">
            Environment
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Weather & Health
          </h1>
          <p className="mt-2 max-w-xl text-sm text-stone-600">
            Real-time updates to help you plan your walk and earn rewards safely.
          </p>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-stone-200/40 bg-white p-8 shadow-lg shadow-stone-200/50">
          <h2 className="text-lg font-bold text-stone-800">Local Conditions</h2>
          <p className="mt-4 text-sm text-stone-500">Loading live weather data...</p>
        </section>

        <section className="rounded-3xl border border-amber-100/50 bg-gradient-to-br from-amber-50/50 to-white p-8 shadow-lg shadow-amber-900/5">
          <h2 className="text-lg font-bold text-amber-900">Health Advice</h2>
          <p className="mt-4 text-sm text-stone-600 italic">
            "Check back here for tips from our experts based on today's weather."
          </p>
        </section>
      </div>
    </div>
  );
}