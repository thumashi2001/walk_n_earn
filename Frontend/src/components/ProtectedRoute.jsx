import { Navigate } from "react-router-dom";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "../services/auth";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : "";
  const role =
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_ROLE_KEY) || ""
      : "";

  if (!token) return <Navigate to="/login" replace />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      return (
        <Navigate to={role === "admin" ? "/admin-dashboard" : "/dashboard"} replace />
      );
    }
  }

  return children;
}

