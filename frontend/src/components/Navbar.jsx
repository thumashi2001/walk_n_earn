import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/rewards", label: "Rewards" },
  { to: "/leaderboard", label: "Leaderboard" },
];

function linkClassName({ isActive }) {
  const base =
    "rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200";
  if (isActive) {
    return `${base} bg-amber-100/90 text-amber-900 shadow-sm ring-1 ring-amber-200/60`;
  }
  return `${base} text-stone-600 hover:bg-white/80 hover:text-stone-800`;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 mb-6">
      <nav className="rounded-2xl bg-white/95 px-4 py-3 shadow-md shadow-stone-200/70 ring-1 ring-stone-100 backdrop-blur-sm sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            end
            className="shrink-0 text-lg font-semibold tracking-tight text-amber-900"
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
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/login" className={linkClassName}>
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-shadow duration-200 ${
                  isActive
                    ? "bg-amber-800 text-white shadow-md shadow-amber-900/20 ring-2 ring-amber-700/30"
                    : "bg-amber-700 text-white shadow-sm hover:bg-amber-800 hover:shadow-md"
                }`
              }
            >
              Sign up
            </NavLink>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700 shadow-sm ring-1 ring-stone-200/80 md:hidden"
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
                  `rounded-xl px-3 py-2.5 text-center text-sm font-semibold ${
                    isActive
                      ? "bg-amber-800 text-white shadow-md"
                      : "bg-amber-700 text-white shadow-sm hover:bg-amber-800"
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
