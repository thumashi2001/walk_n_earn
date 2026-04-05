import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLiveWeatherDetails } from "../../services/weatherService";

export default function LocalWeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLiveWeatherDetails()
      .then(setWeather)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-3xl border border-stone-200/40 bg-white p-8 shadow-lg shadow-stone-200/50 min-h-[200px]">
      <h2 className="text-lg font-bold text-stone-800">Local Conditions</h2>
      
      {loading && <p className="mt-4 text-sm text-stone-500 animate-pulse">Fetching weather...</p>}
      {error && <p className="mt-4 text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

      {weather && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-5xl font-black text-stone-900">{Math.round(weather.temperature)}°C</p>
            <p className="mt-1 text-sm font-bold text-amber-700 capitalize">{weather.description}</p>
            <div className="mt-4 flex gap-4 text-[10px] font-bold text-stone-400 uppercase">
              <span>Wind: {weather.wind_speed} km/h</span>
              <span>Humidity: {weather.humidity}%</span>
            </div>
          </div>
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} className="h-24 w-24" alt="weather" />
        </motion.div>
      )}
    </section>
  );
}