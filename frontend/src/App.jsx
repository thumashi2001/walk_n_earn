import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Rewards from "./pages/Rewards";

function Home() {
  return <h1 className="p-6">Home Page</h1>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-[#e6a65c] to-[#bfb8ae] p-6">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;