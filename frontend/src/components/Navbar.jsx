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
    return `${base} bg-gradient-to-b from-amber-100/95 to-amber-50/90 text-amber-950 shadow-md shadow-amber-900/10 ring-1 ring-amber-200/70`;
  }
  return `${base} text-stone-600 hover:bg-white/90 hover:text-stone-900 hover:shadow-sm hover:shadow-stone-200/50`;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  useLocation();
  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("role") === "admin";

  return (
    <header className="sticky top-0 z-40 mb-6">
      <nav className="rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg shadow-stone-300/25 ring-1 ring-stone-200/60 backdrop-blur-md transition-shadow duration-500 hover:shadow-xl hover:shadow-stone-300/30 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            end
            className="shrink-0 text-lg font-semibold tracking-tight text-amber-900 transition-all duration-300 hover:text-amber-950 hover:drop-shadow-sm active:scale-[0.98]"
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
              <>
                <NavLink to="/admin" className={linkClassName}>
                  Admin
                </NavLink>
                <NavLink to="/weather-admin" className={linkClassName}>
                  Weather Admin
                </NavLink>
              </>
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
                    ? "bg-gradient-to-b from-amber-800 to-amber-900 text-white shadow-lg shadow-amber-900/35 ring-2 ring-amber-700/40"
                    : "bg-gradient-to-b from-amber-600 to-amber-800 text-white shadow-md shadow-amber-900/25 hover:from-amber-700 hover:to-amber-900 hover:shadow-lg"
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
                <span className="block h-0.5 w-5 rounded-full bg-stone-600" />
                <span className="block h-0.5 w-5 rounded-full bg-stone-600" />
                <span className="block h-0.5 w-5 rounded-full bg-stone-600" />
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
                      ? "bg-gradient-to-b from-amber-800 to-amber-900 text-white shadow-lg shadow-amber-900/30"
                      : "bg-gradient-to-b from-amber-600 to-amber-800 text-white shadow-md hover:from-amber-700 hover:to-amber-900 hover:shadow-lg"
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
