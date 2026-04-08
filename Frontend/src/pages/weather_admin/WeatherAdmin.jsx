import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "../../services/auth";
import { fetchAllAdvices, deleteAdvice } from "../../services/weather/adminWeatherService";
import AdviceList from "../weather_admin/AdviceList";

export default function WeatherAdmin() {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchAllAdvices();
      setAdvices(data);
    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await deleteAdvice(id);
      setAdvices(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (!(localStorage.getItem(AUTH_TOKEN_KEY) && localStorage.getItem(AUTH_ROLE_KEY) === "admin")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/98 via-white/95 to-amber-50/30 px-5 py-7 shadow-xl shadow-stone-300/25 backdrop-blur-sm sm:px-8 sm:py-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">Control Panel</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Weather Admin</h1>
          </div>
          <button className="rounded-2xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-stone-800 transition-all">
            + New Advice
          </button>
        </div>
      </header>
      
      <section className="overflow-hidden rounded-3xl border border-stone-200/40 bg-white shadow-xl">
        <AdviceList advices={advices} loading={loading} onDelete={handleDelete} />
      </section>
    </div>
  );
}