import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "../../services/auth";
import { 
  fetchAllAdvices, 
  deleteAdvice, 
  createHealthAdvice 
} from "../../services/weather/adminWeatherService";
import AdviceList from "../weather_admin/AdviceList";
import AdviceForm from "../../pages/weather_admin/AdviceForm"; // Ensure path is correct

export default function WeatherAdmin() {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);

  // Load data from backend
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllAdvices();
      setAdvices(data);
    } catch (err) {
      console.error("Admin fetch error", err);
      setError("Failed to synchronize with weather server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create
  const handleCreate = async (newData) => {
    try {
      await createHealthAdvice(newData);
      setIsFormOpen(false);
      loadData(); // Refresh list after adding
    } catch (err) {
      alert(err.message || "Failed to create advice. Check trigger logic.");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this advice?")) return;
    try {
      await deleteAdvice(id);
      setAdvices(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert("Delete failed. Please try again.");
    }
  };

  // Auth Guard
  if (!(localStorage.getItem(AUTH_TOKEN_KEY) && localStorage.getItem(AUTH_ROLE_KEY) === "admin")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/98 via-white/95 to-amber-50/30 px-5 py-7 shadow-xl shadow-stone-300/25 backdrop-blur-sm sm:px-8 sm:py-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">Control Panel</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Weather Admin</h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage automated health alerts and environmental triggers.
            </p>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="rounded-2xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-95"
          >
            + New Advice
          </button>
        </div>
      </header>
      
      {/* Error Feedback */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* Advice Table List */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/40 bg-white shadow-xl">
        <AdviceList 
          advices={advices} 
          loading={loading} 
          onDelete={handleDelete} 
        />
      </section>

      {/* Creation Modal */}
      <AdviceForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={handleCreate} 
      />
    </div>
  );
}