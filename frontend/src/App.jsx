import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Walking from "./pages/Walking";
import Location from "./pages/Location";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function RoleLanding() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "";
  if (!token) return <Home />;
  return role === "admin" ? (
    <Admin />
  ) : (
    <Dashboard />
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fff4db] via-[#ffe4c4] to-[#ffd2ad] px-4 pb-12 pt-4 sm:px-6 dark:bg-gradient-to-b dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden
        >
          <div className="absolute left-[10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#FFA500]/35 via-[#FF7518]/20 to-transparent blur-3xl dark:from-[#FFA500]/18 dark:via-[#FF7518]/10" />
          <div className="absolute bottom-[-5%] right-[-5%] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tl from-[#FF5F1F]/25 via-[#FFA500]/20 to-transparent blur-3xl dark:from-[#FF5F1F]/14 dark:via-[#FFA500]/10" />
          <div className="absolute bottom-1/3 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-white/40 blur-3xl dark:bg-white/5" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Navbar />
          <main className="min-h-[50vh]">
            <Routes>
              <Route path="/" element={<RoleLanding />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <About />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rewards"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Rewards />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/walking"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Walking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/location"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Location />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={<Navigate to="/admin-dashboard" replace />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
