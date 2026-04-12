import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import AdminRoute from "../../src/components/AdminRoute";

describe("AdminRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function ui(initialUser) {
    if (initialUser) {
      localStorage.setItem("walknEarnUser", JSON.stringify(initialUser));
    }
    return (
      <MemoryRouter initialEntries={["/admin"]}>
        <AuthProvider>
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <p>Admin only</p>
                </AdminRoute>
              }
            />
            <Route path="/login" element={<p>Login page</p>} />
            <Route path="/app/walk" element={<p>Walk</p>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
  }

  it("sends guests to login", () => {
    render(ui(undefined));
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("allows admin users", () => {
    render(ui({ fullName: "Admin", role: "admin" }));
    expect(screen.getByText("Admin only")).toBeInTheDocument();
  });

  it("redirects non-admins", () => {
    render(ui({ fullName: "User", role: "user" }));
    expect(screen.getByText("Walk")).toBeInTheDocument();
  });
});
