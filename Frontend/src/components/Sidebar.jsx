import SidebarItem from "./SidebarItem";

export default function Sidebar({ activeKey, onNavigate, onOpenSettings }) {
  const items = [
    { key: "home", label: "Home", icon: "🏠", action: () => onNavigate("/") },
    {
      key: "profile",
      label: "Profile",
      icon: "👤",
      action: () => onNavigate("/profile"),
    },
    {
      key: "location",
      label: "Location",
      icon: "📍",
      action: () => onNavigate("/location"),
    },
    {
      key: "leaderboard",
      label: "Leaderboard",
      icon: "🏆",
      action: () => onNavigate("/leaderboard"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: "⚙️",
      action: () => onOpenSettings(),
    },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-3xl border border-white/60 bg-white/80 py-5 shadow-sm ring-1 ring-stone-200/60 dark:border-white/10 dark:bg-stone-950/60 dark:ring-white/10">
      {items.map((it) => (
        <SidebarItem
          key={it.key}
          label={it.label}
          icon={it.icon}
          active={activeKey === it.key}
          onClick={it.action}
        />
      ))}
    </div>
  );
}

