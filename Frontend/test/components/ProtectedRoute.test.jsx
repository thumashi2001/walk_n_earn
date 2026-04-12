import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { AUTH_TOKEN_KEY, AUTH_ROLE_KEY } from "../../src/services/auth";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderRoute(initialPath = "/x") {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/x"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <p>Secret</p>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<p>Login page</p>} />
          <Route path="/dashboard" element={<p>Dashboard</p>} />
          <Route path="/admin-dashboard" element={<p>Admin dash</p>} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("redirects to login when there is no token", () => {
    renderRoute();
    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Secret")).not.toBeInTheDocument();
  });

  it("renders children when token exists and role is allowed", () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "t");
    localStorage.setItem(AUTH_ROLE_KEY, "admin");
    renderRoute();
    expect(screen.getByText("Secret")).toBeInTheDocument();
  });

  it("redirects non-admin away from admin-only route", () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "t");
    localStorage.setItem(AUTH_ROLE_KEY, "user");
    renderRoute();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
