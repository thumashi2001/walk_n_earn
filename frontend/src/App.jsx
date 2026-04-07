import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fff4db] via-[#ffe4c4] to-[#ffd2ad] px-4 pb-12 pt-4 sm:px-6">
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden
        >
          <div className="absolute left-[10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#FFA500]/35 via-[#FF7518]/20 to-transparent blur-3xl" />
          <div className="absolute bottom-[-5%] right-[-5%] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tl from-[#FF5F1F]/25 via-[#FFA500]/20 to-transparent blur-3xl" />
          <div className="absolute bottom-1/3 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Navbar />
          <main className="min-h-[50vh]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
