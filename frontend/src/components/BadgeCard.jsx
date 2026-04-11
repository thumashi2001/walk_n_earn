export default function BadgeCard({ icon, title, subtitle }) {
  return (
    <div className="group rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm shadow-[#FF7518]/10 ring-1 ring-stone-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5F1F]/15 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#FFA500] via-[#FF7518] to-[#FF5F1F] text-lg text-white shadow-md shadow-[#FF7518]/25">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

