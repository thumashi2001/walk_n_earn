import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import LoginPage from "./components/Auth/LoginPage";
import LeaderboardPage from "./components/Leaderboard/LeaderboardPage";
import AdminLeaderboardPage from "./components/Leaderboard/AdminLeaderboardPage";
import RewardsPage from "./components/Rewards/RewardsPage";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* All authenticated pages share the Navbar layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/admin/leaderboard" element={<AdminLeaderboardPage />} />
                  <Route path="/rewards" element={<RewardsPage />} />
                  {/* Default redirect */}
                  <Route path="*" element={<Navigate to="/leaderboard" replace />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
