export default function NotificationBell({ unreadCount = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-700 shadow-sm ring-1 ring-stone-200 transition-all duration-300 hover:bg-[#FFA500]/10 active:scale-95 dark:bg-stone-900/70 dark:text-stone-100 dark:ring-white/10 dark:hover:bg-white/10"
      aria-label="Open notifications"
      title="Notifications"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
      {unreadCount > 0 ? (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-stone-950" />
      ) : null}
    </button>
  );
}

