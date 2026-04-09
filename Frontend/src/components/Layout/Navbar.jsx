import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClasses = (to) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === to
        ? "bg-green-500 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <span className="text-xl">🚶</span>
          <span>Walk N Earn</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Link to="/leaderboard" className={linkClasses("/leaderboard")}>
            🏆 Leaderboard
          </Link>
          <Link to="/rewards" className={linkClasses("/rewards")}>
            🎁 Rewards
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin/leaderboard" className={linkClasses("/admin/leaderboard")}>
              🛠 Manage
            </Link>
          )}
        </div>

        {/* User info + logout system  */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-sm text-green-600 font-semibold">
            ⭐ {user?.totalPoints ?? 0} pts
          </span>
          <span className="hidden sm:block text-sm text-gray-600 max-w-[120px] truncate">
            {user?.fullName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
