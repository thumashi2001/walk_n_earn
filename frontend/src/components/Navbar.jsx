import { NavLink } from "react-router-dom";

export default function Navbar() {
  const baseStyle = "px-4 py-1 rounded-full text-sm transition";

  return (
    <div className="flex justify-between items-center bg-[#f5f5f5] px-6 py-3 rounded-full shadow-md">

      {/* Logo */}
      <h1 className="font-bold text-lg text-amber-700">
        Step2Earn
      </h1>

      {/* Menu */}
      <div className="flex gap-4">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? "bg-[#e2a45c]" : "bg-gray-200 hover:bg-gray-300"}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/rewards"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? "bg-[#e2a45c]" : "bg-gray-200 hover:bg-gray-300"}`
          }
        >
          Rewards
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? "bg-[#e2a45c]" : "bg-gray-200 hover:bg-gray-300"}`
          }
        >
          Leaderboard
        </NavLink>

      </div>

      {/* User */}
      <div className="bg-gray-200 px-4 py-1 rounded-full text-sm">
        👤 User
      </div>
    </div>
  );
}