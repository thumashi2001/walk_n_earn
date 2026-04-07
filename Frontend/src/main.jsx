import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LeaderboardProvider } from "./context/LeaderboardContext.jsx";
import { RewardProvider } from "./context/RewardContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LeaderboardProvider>
          <RewardProvider>
            <App />
          </RewardProvider>
        </LeaderboardProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
