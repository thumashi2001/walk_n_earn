import DarkModeToggle from "./DarkModeToggle";

const NOTIF_TOGGLE_KEY = "notificationsEnabled";

function getInitialNotifEnabled() {
  const raw = localStorage.getItem(NOTIF_TOGGLE_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return true;
}

export default function SettingsModal({ open, onClose, onLogout }) {
  const enabled = getInitialNotifEnabled();

  function setEnabled(next) {
    localStorage.setItem(NOTIF_TOGGLE_KEY, String(Boolean(next)));
    window.dispatchEvent(new Event("storage"));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        aria-label="Close settings"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-2xl shadow-stone-900/20 ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/90 dark:ring-white/10">
        <div className="flex items-center justify-between border-b border-stone-100/80 px-6 py-4 dark:border-white/10">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1.5 text-sm font-semibold text-stone-600 transition-all duration-200 hover:bg-stone-100 hover:text-stone-900 active:scale-95 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between rounded-2xl border border-stone-200/70 bg-white/70 px-4 py-3 shadow-sm ring-1 ring-stone-100 dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
            <div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Dark mode <span aria-hidden>🌙</span>
              </p>
              <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                Toggle app theme
              </p>
            </div>
            <DarkModeToggle />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-stone-200/70 bg-white/70 px-4 py-3 shadow-sm ring-1 ring-stone-100 dark:border-white/10 dark:bg-white/5 dark:ring-white/10">
            <div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Notifications
              </p>
              <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                Enable notification UI
              </p>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-[#FF5F1F] focus:ring-[#FF7518]"
              />
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                {enabled ? "On" : "Off"}
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-2xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#FF7518]/25 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

