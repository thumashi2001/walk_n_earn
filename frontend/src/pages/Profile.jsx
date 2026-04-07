import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { getCurrentUser } from "../services/api";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY, clearSession } from "../services/auth";

const DEFAULT_LOCATION = "Location unavailable";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const role = localStorage.getItem(AUTH_ROLE_KEY) || "user";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [locationText, setLocationText] = useState(DEFAULT_LOCATION);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    const existingPreview = localStorage.getItem("profilePreviewImage");
    if (existingPreview) setAvatarPreview(existingPreview);

    async function loadProfile() {
      setError("");
      setLoading(true);
      try {
        const me = await getCurrentUser();
        if (!mounted) return;
        setUser(me);
      } catch (err) {
        const message =
          err?.response?.data?.message || "Could not load profile details.";
        if (mounted) setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationText(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state;
          setLocationText(city || DEFAULT_LOCATION);
        } catch {
          setLocationText(DEFAULT_LOCATION);
        }
      },
      () => setLocationText(DEFAULT_LOCATION),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 120000 }
    );
  }, []);

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = typeof reader.result === "string" ? reader.result : "";
      if (!next) return;
      setAvatarPreview(next);
      localStorage.setItem("profilePreviewImage", next);
    };
    reader.readAsDataURL(file);
  }

  function handleLogout() {
    setLoggingOut(true);
    clearSession();
    localStorage.removeItem("profilePreviewImage");
    window.setTimeout(() => {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }, 200);
  }

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/70 bg-gradient-to-br from-white/95 via-white/90 to-[#FFA500]/12 px-6 py-7 shadow-lg shadow-[#FF7518]/15 ring-1 ring-[#FFA500]/20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5F1F]">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          Your account
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Manage personal info and monitor your walking impact.
        </p>
      </section>

      {loading ? (
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 rounded-3xl border border-white/70 bg-white/90 py-16 shadow-md shadow-[#FF7518]/10">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#FFA500]/30 border-t-[#FF5F1F]" />
          <p className="text-sm font-medium text-stone-600">Loading profile...</p>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : (
        <ProfileCard
          user={user}
          role={role}
          avatarPreview={avatarPreview}
          onAvatarChange={handleAvatarChange}
          locationText={locationText}
          loggingOut={loggingOut}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
