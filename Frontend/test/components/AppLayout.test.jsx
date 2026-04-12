import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import AppLayout from "../../src/components/AppLayout";

describe("AppLayout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders shell, outlet, footer, and logs out to login", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "walknEarnUser",
      JSON.stringify({ fullName: "Pat", role: "user" })
    );
    render(
      <MemoryRouter initialEntries={["/app/walk"]}>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/app/walk" element={<div>Walk page</div>} />
            </Route>
            <Route path="/login" element={<div>Login screen</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Walk n Earn")).toBeInTheDocument();
    expect(screen.getByText("Pat")).toBeInTheDocument();
    expect(screen.getByText("Walk page")).toBeInTheDocument();
    expect(
      screen.getByText(/Eco friendly walking rewards platform/i)
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(screen.getByText("Login screen")).toBeInTheDocument();
  });
});
