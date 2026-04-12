function typeStyles(type) {
  switch (type) {
    case "reward":
      return "bg-[#FFA500]/15 text-[#7a2b00] ring-[#FFA500]/25";
    case "alert":
      return "bg-red-500/10 text-red-700 ring-red-200/60 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-900/40";
    default:
      return "bg-[#FF7518]/10 text-stone-700 ring-stone-200/60 dark:bg-white/10 dark:text-stone-200 dark:ring-white/10";
  }
}

function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function NotificationDropdown({
  open,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-2xl shadow-stone-900/10 ring-1 ring-stone-200/60 backdrop-blur-md dark:border-white/10 dark:bg-stone-950/90 dark:ring-white/10"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between border-b border-stone-100/80 px-4 py-3 dark:border-white/10">
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
          Notifications
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-[#7a2b00] hover:bg-[#FFA500]/10 dark:text-stone-200 dark:hover:bg-white/10"
          >
            Mark all read
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/10"
            aria-label="Close notifications"
          >
            ×
          </button>
        </div>
      </div>

      <div className="max-h-[360px] overflow-auto p-2">
        {notifications.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
            No notifications yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => onMarkRead(n.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left shadow-sm transition-all duration-200 ${
                    n.read
                      ? "border-stone-200/60 bg-white/70 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      : "border-[#FFA500]/35 bg-gradient-to-r from-[#FFA500]/12 to-[#FF5F1F]/8 hover:from-[#FFA500]/16 hover:to-[#FF5F1F]/10 dark:border-[#FFA500]/30 dark:bg-white/10 dark:hover:bg-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`text-sm ${
                          n.read
                            ? "font-medium text-stone-800 dark:text-stone-200"
                            : "font-semibold text-stone-900 dark:text-stone-100"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        {formatTime(n.timestamp)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${typeStyles(
                        n.type
                      )}`}
                    >
                      {n.type}
                    </span>
                  </div>
                  {!n.read ? (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-xs font-medium text-red-600 dark:text-red-300">
                        Unread
                      </span>
                    </div>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

