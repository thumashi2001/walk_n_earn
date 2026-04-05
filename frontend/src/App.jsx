import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#faf7f0] via-[#fffefb] to-[#f5f0e8] px-4 pb-12 pt-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
