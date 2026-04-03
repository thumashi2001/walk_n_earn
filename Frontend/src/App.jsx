import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const user = JSON.parse(localStorage.getItem("walknEarnUser"));

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#edaf5e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/home" replace /> : <Signup />}
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;