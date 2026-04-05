import LocalWeatherCard from "../../components/weather/LocalWeatherCard";
import HealthAdviceCard from "../../components/weather/HealthAdviceCard";

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

      {/* Main Content Grid - Calling sections separately */}
      <div className="grid gap-6 md:grid-cols-2">
        <LocalWeatherCard />
        <HealthAdviceCard />
      </div>
    </div>
  );
}