import { Navigate } from "react-router-dom";

export default function Dashboard() {
  // User dashboard landing (keeps existing UI)
  return <Navigate to="/rewards" replace />;
}

