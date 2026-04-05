import { Navigate } from "react-router-dom";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "../../services/auth";

function isAdminSession() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const role = localStorage.getItem(AUTH_ROLE_KEY);
  return Boolean(token && role === "admin");
}

export default function WeatherAdmin() {
  if (!isAdminSession()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-white/98 via-white/95 to-amber-50/30 px-5 py-7 shadow-xl shadow-stone-300/25 backdrop-blur-sm sm:px-8 sm:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">Admin</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Weather & Health Advice
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Manage weather-based health tips and environmental alerts for users.
        </p>
      </header>
      
      {/* Add your Weather Admin logic/components here */}
      <section className="rounded-3xl border border-stone-200/40 bg-white p-10 text-center text-stone-500 shadow-xl">
        Weather management tools coming soon...
      </section>
    </div>
  );
}