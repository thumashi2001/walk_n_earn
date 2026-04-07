import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/rewards", label: "Rewards" },
  { to: "/leaderboard", label: "Leaderboard" },
];

function linkClassName({ isActive }) {
  const base =
    "rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 ease-out";
  if (isActive) {
    return `${base} bg-gradient-to-b from-[#FFA500]/20 to-[#FF7518]/10 text-[#7a2b00] shadow-md shadow-[#FF7518]/20 ring-1 ring-[#FFA500]/35`;
  }
  return `${base} text-stone-600 hover:bg-white/90 hover:text-stone-900 hover:shadow-sm hover:shadow-stone-200/50`;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  useLocation();
  const isAdmin =
    typeof window !== "undefined" &&
    localStorage.getItem("role") === "admin";

  return (
    <header className="sticky top-0 z-40 mb-6">
      <nav className="rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg shadow-stone-300/25 ring-1 ring-stone-200/60 backdrop-blur-md transition-shadow duration-500 hover:shadow-xl hover:shadow-stone-300/30 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            end
            className="shrink-0 text-lg font-semibold tracking-tight text-[#7a2b00] transition-all duration-300 hover:text-[#5f2100] hover:drop-shadow-sm active:scale-[0.98]"
            onClick={() => setMenuOpen(false)}
          >
            Walk n Earn
          </NavLink>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClassName}>
                {label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={linkClassName}>
                Admin
              </NavLink>
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/login" className={linkClassName}>
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.97] ${
                  isActive
                    ? "bg-gradient-to-b from-[#FF7518] to-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/35 ring-2 ring-[#FF7518]/45"
                    : "bg-gradient-to-b from-[#FFA500] via-[#FF7518] to-[#FF5F1F] text-white shadow-md shadow-[#FF7518]/30 hover:from-[#FF7518] hover:via-[#FF5F1F] hover:to-[#FF5F1F] hover:shadow-lg"
                }`
              }
            >
              Sign up
            </NavLink>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-stone-50 to-stone-100/90 text-stone-700 shadow-md shadow-stone-300/20 ring-1 ring-stone-200/80 transition-all duration-300 hover:shadow-lg active:scale-95 md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <span className="text-xl leading-none">×</span>
            ) : (
              <span className="flex flex-col gap-1.5" aria-hidden>
                    <span className="block h-0.5 w-5 rounded-full bg-[#7a2b00]" />
                <span className="block h-0.5 w-5 rounded-full bg-[#7a2b00]" />
                <span className="block h-0.5 w-5 rounded-full bg-[#7a2b00]" />
              </span>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-4 flex flex-col gap-1 border-t border-stone-100 pt-4 md:hidden">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={linkClassName}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={linkClassName}
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </NavLink>
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-stone-100 pt-3">
              <NavLink
                to="/login"
                className={linkClassName}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                    isActive
                      ? "bg-gradient-to-b from-[#FF7518] to-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/30"
                      : "bg-gradient-to-b from-[#FFA500] via-[#FF7518] to-[#FF5F1F] text-white shadow-md hover:from-[#FF7518] hover:via-[#FF5F1F] hover:to-[#FF5F1F] hover:shadow-lg"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
