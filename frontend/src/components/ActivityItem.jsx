function formatDateLabel(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "long",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function ActivityItem({ item }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-sm shadow-[#FF7518]/10 ring-1 ring-stone-200/60 transition-all duration-200 hover:bg-white dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10 dark:hover:bg-white/10">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
          {formatDateLabel(item.date)}
        </p>
        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
          {item.distanceKm} km
        </p>
      </div>
      <div className="shrink-0 rounded-full bg-gradient-to-r from-[#FFA500]/20 to-[#FF5F1F]/15 px-3 py-1 text-xs font-semibold text-[#7a2b00] ring-1 ring-[#FFA500]/25 dark:bg-white/10 dark:text-stone-200 dark:ring-white/10">
        +{item.points} pts
      </div>
    </div>
  );
}

