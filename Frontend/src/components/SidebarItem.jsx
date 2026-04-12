export default function SidebarItem({
  label,
  icon,
  active,
  onClick,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
        active
          ? "bg-gradient-to-br from-[#FFA500] via-[#FF7518] to-[#FF5F1F] text-white shadow-lg shadow-[#FF7518]/25 ring-1 ring-white/50"
          : "bg-white text-stone-700 shadow-sm ring-1 ring-stone-200/60 hover:-translate-y-0.5 hover:bg-[#FFA500]/10 hover:shadow-md dark:bg-white/5 dark:text-stone-100 dark:ring-white/10 dark:hover:bg-white/10"
      } active:scale-[0.97]`}
      aria-label={ariaLabel || label}
      title={label}
    >
      <span className={`text-lg ${active ? "" : "group-hover:scale-110"} transition-transform duration-200`}>
        {icon}
      </span>
    </button>
  );
}

