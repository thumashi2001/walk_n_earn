import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY, clearSession } from "../services/auth";
import ActivityItem from "../components/ActivityItem";
import RedeemItem from "../components/RedeemItem";
import BadgeCard from "../components/BadgeCard";
import Sidebar from "../components/Sidebar";
import SettingsModal from "../components/SettingsModal";
import {
  loadStoredNotifications,
  subscribeToNotificationUpdates,
} from "../utils/notifications";

const DEFAULT_LOCATION = "Location unavailable";
const PROFILE_LOCAL_KEY = "profileLocal";

// --- Helper Functions ---
function initialsFromName(name = "") {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function loadLocalProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_LOCAL_KEY);
    if (!raw) return { country: "", gender: "", bio: "" };
    const parsed = JSON.parse(raw);
    return {
      country: parsed?.country ?? "",
      gender: parsed?.gender ?? "",
      bio: parsed?.bio ?? "",
    };
  } catch {
    return { country: "", gender: "", bio: "" };
  }
}

function saveLocalProfile(next) {
  localStorage.setItem(PROFILE_LOCAL_KEY, JSON.stringify(next));
}

function formatNotifTime(ts) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // --- State Hooks ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [locationText, setLocationText] = useState(DEFAULT_LOCATION);
  const [loggingOut, setLoggingOut] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [localProfile, setLocalProfile] = useState(() => loadLocalProfile());
  const [draft, setDraft] = useState(() => loadLocalProfile());
  const [notifTick, setNotifTick] = useState(0);

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const role = localStorage.getItem(AUTH_ROLE_KEY) || "user";

  // --- Effect Hooks ---
  useEffect(() => {
    return subscribeToNotificationUpdates(() =>
      setNotifTick((t) => t + 1)
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    const existingPreview = localStorage.getItem("profilePreviewImage");
    if (existingPreview) setAvatarPreview(existingPreview);

    async function loadProfile() {
      if (!token) return; // Don't fetch if no token
      setError("");
      setLoading(true);
      try {
        const me = await getCurrentUser();
        if (!mounted) return;
        setUser(me);
      } catch (err) {
        const message = err?.response?.data?.message || "Could not load profile details.";
        if (mounted) setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [token]);

  useEffect(() => {
    const lp = loadLocalProfile();
    setLocalProfile(lp);
    setDraft(lp);
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
          const city = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.state;
          setLocationText(city || DEFAULT_LOCATION);
        } catch {
          setLocationText(DEFAULT_LOCATION);
        }
      },
      () => setLocationText(DEFAULT_LOCATION),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 120000 }
    );
  }, []);

  // --- Memo Hooks ---
  const notifications = useMemo(() => {
    const isAdmin = role === "admin";
    return loadStoredNotifications(isAdmin);
  }, [notifTick, role]);

  const recentNotifications = useMemo(
    () => notifications.slice(0, 5),
    [notifications]
  );

  const mockActivities = useMemo(
    () => [
      { id: "a1", date: "2026-03-28", distanceKm: 3.2, points: 32 },
      { id: "a2", date: "2026-03-24", distanceKm: 5.0, points: 50 },
      { id: "a3", date: "2026-03-18", distanceKm: 2.1, points: 21 },
      { id: "a4", date: "2026-03-12", distanceKm: 4.4, points: 44 },
    ], []
  );

  const mockRedeems = useMemo(
    () => [
      { id: "r1", name: "Chocolate Muffin", points: 50, date: "2026-04-02" },
      { id: "r2", name: "Coffee Voucher", points: 80, date: "2026-03-10" },
    ], []
  );

  const badges = useMemo(
    () => [
      { id: "b1", icon: "🏆", title: "Top Walker", subtitle: "Reached #1 spot" },
      { id: "b2", icon: "🌱", title: "Eco Hero", subtitle: "CO2 saver" },
      { id: "b3", icon: "🔥", title: "Consistent Walker", subtitle: "Weekly streak" },
    ], []
  );

  const activeKey = useMemo(() => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname.startsWith("/location")) return "location";
    if (pathname.startsWith("/leaderboard")) return "leaderboard";
    return "profile";
  }, [pathname]);

  // --- Handlers ---
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
    // Short delay for visual feedback before navigation
    window.setTimeout(() => {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }, 200);
  }

  function startEdit() {
    setFormError("");
    setDraft(localProfile);
    setEditing(true);
  }

  function cancelEdit() {
    setFormError("");
    setDraft(localProfile);
    setEditing(false);
  }

  async function saveEdit() {
    if (draft.bio && draft.bio.length > 240) {
      setFormError("Bio must be 240 characters or less.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      saveLocalProfile(draft);
      setLocalProfile(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  // --- CONDITIONAL REDIRECT (Must be after all Hooks) ---
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // --- Main Render ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 sm:text-3xl">
            Welcome{user?.fullName ? `, ${user.fullName}` : ""}{" "}
            <span aria-hidden>👋</span>
          </p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <input placeholder="Search" className="w-full rounded-2xl border border-white/70 bg-white/90 py-2.5 pl-11 pr-4 text-sm text-stone-800 shadow-sm ring-1 ring-stone-200/60 outline-none transition-all duration-300 placeholder:text-stone-400 focus:ring-2 focus:ring-[#FF7518]/35 dark:border-white/10 dark:bg-stone-950/60 dark:text-stone-100 dark:ring-white/10" />
          </div>

          <button type="button" onClick={handleLogout} disabled={loggingOut} className="rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FF7518]/25 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60">
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 rounded-3xl border border-white/70 bg-white/90 py-16 shadow-md shadow-[#FF7518]/10 ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#FFA500]/30 border-t-[#FF5F1F]" />
          <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Loading profile...</p>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[84px_1fr]">
          <aside className="hidden lg:flex">
            <Sidebar activeKey={activeKey} onNavigate={(to) => navigate(to)} onOpenSettings={() => setSettingsOpen(true)} />
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#FF7518]/10 ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-[#FFA500] via-[#FF7518] to-[#FF5F1F] p-[2px] shadow-md shadow-[#FF7518]/25">
                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-stone-950">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-[#7a2b00] dark:text-stone-100">{initialsFromName(user?.fullName || user?.email)}</span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-base font-semibold text-stone-900 dark:text-stone-100">{user?.fullName || "User"}</p>
                      {role === "admin" && (
                        <span className="rounded-full bg-gradient-to-r from-[#FFA500] to-[#FF5F1F] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">Admin</span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">{user?.email || "—"}</p>
                    <p className="mt-1 text-xs font-medium text-[#a33a00]/85 dark:text-stone-300">You are currently in: {locationText}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="profile-avatar-upload" className="cursor-pointer rounded-2xl border border-[#FFA500]/35 bg-white px-4 py-2 text-sm font-semibold text-[#7a2b00] shadow-sm transition-all duration-200 hover:bg-[#FFA500]/10 dark:bg-white/5 dark:text-stone-200 dark:ring-1 dark:ring-white/10 dark:hover:bg-white/10">Upload</label>
                  <input id="profile-avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  {!editing ? (
                    <button type="button" onClick={startEdit} className="rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#FF7518]/25 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]">Edit</button>
                  ) : (
                    <>
                      <button type="button" onClick={cancelEdit} disabled={saving} className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-all duration-200 hover:bg-stone-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-stone-200 dark:hover:bg-white/10">Cancel</button>
                      <button type="button" onClick={saveEdit} disabled={saving} className="rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#FF7518]/25 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
                    </>
                  )}
                </div>
              </div>

              {formError && (
                <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">{formError}</div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Full Name</label>
                  <input value={user?.fullName || ""} readOnly className="mt-1.5 w-full rounded-2xl border border-stone-200/90 bg-stone-50 px-4 py-3 text-sm text-stone-700 shadow-inner outline-none dark:border-white/10 dark:bg-white/5 dark:text-stone-200" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Email</label>
                  <input value={user?.email || ""} readOnly className="mt-1.5 w-full rounded-2xl border border-stone-200/90 bg-stone-50 px-4 py-3 text-sm text-stone-700 shadow-inner outline-none dark:border-white/10 dark:bg-white/5 dark:text-stone-200" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Country</label>
                  <input value={editing ? draft.country : localProfile.country} onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))} readOnly={!editing} placeholder="Your country" className="mt-1.5 w-full rounded-2xl border border-stone-200/90 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#FF7518]/35 dark:border-white/10 dark:bg-stone-950/40 dark:text-stone-100 dark:placeholder:text-stone-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Gender</label>
                  <select value={editing ? draft.gender : localProfile.gender} onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value }))} disabled={!editing} className="mt-1.5 w-full rounded-2xl border border-stone-200/90 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#FF7518]/35 disabled:bg-stone-50 disabled:text-stone-600 dark:border-white/10 dark:bg-stone-950/40 dark:text-stone-100 dark:disabled:bg-white/5 dark:disabled:text-stone-300">
                    <option value="">Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Bio</label>
                  <textarea value={editing ? draft.bio : localProfile.bio} onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))} readOnly={!editing} rows={4} placeholder="Write a short bio..." className="mt-1.5 w-full resize-y rounded-2xl border border-stone-200/90 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#FF7518]/35 dark:border-white/10 dark:bg-stone-950/40 dark:text-stone-100 dark:placeholder:text-stone-500" />
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{String((editing ? draft.bio : localProfile.bio) || "").length}/240</p>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#FF7518]/10 ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10">
                <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Activity history</h2>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Mock data (walking module will plug in here)</p>
                <div className="mt-4 space-y-3">
                  {mockActivities.map((a) => (<ActivityItem key={a.id} item={a} />))}
                </div>
              </section>

              <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#FF7518]/10 ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10">
                <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Redeem history</h2>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Mock data (reward history integration ready)</p>
                <div className="mt-4 space-y-3">
                  {mockRedeems.map((r) => (<RedeemItem key={r.id} item={r} />))}
                </div>
              </section>
            </div>

            <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#FF7518]/10 ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Badges</h2>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Gamification (mock earned badges)</p>
                </div>
                <div className="rounded-full bg-gradient-to-r from-[#FFA500]/18 to-[#FF5F1F]/12 px-3 py-1 text-xs font-semibold text-[#7a2b00] ring-1 ring-[#FFA500]/25 dark:bg-white/10 dark:text-stone-200 dark:ring-white/10">{badges.length} earned</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((b) => (<BadgeCard key={b.id} icon={b.icon} title={b.title} subtitle={b.subtitle} />))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#FF7518]/10 ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10">
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Recent notifications</h2>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Showing last {Math.min(5, recentNotifications.length)} items</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {recentNotifications.length === 0 ? (
                  <div className="rounded-2xl border border-stone-200/70 bg-stone-50 px-4 py-4 text-sm text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300 sm:col-span-2">No notifications available yet.</div>
                ) : (
                  recentNotifications.map((n) => (
                    <div key={n.id} className={`rounded-2xl border px-4 py-3 shadow-sm ring-1 transition-all duration-200 ${n.read ? "border-stone-200/70 bg-white/80 ring-stone-200/60 dark:border-white/10 dark:bg-white/5 dark:ring-white/10" : "border-[#FFA500]/35 bg-gradient-to-br from-[#FFA500]/12 to-[#FF5F1F]/8 ring-[#FFA500]/20 dark:border-[#FFA500]/30 dark:bg-white/10 dark:ring-white/10"}`}>
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{n.message}</p>
                      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{formatNotifTime(n.timestamp)} • {n.type}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} onLogout={handleLogout} />
    </div>
  );
}