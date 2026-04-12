import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../src/components/Navbar";
import { AUTH_TOKEN_KEY, AUTH_ROLE_KEY } from "../../src/services/auth";

const mockGetCurrentUser = jest.fn(() =>
  Promise.resolve({ fullName: "Sam Member", email: "sam@example.com" })
);

jest.mock("../../src/services/api", () => ({
  getCurrentUser: (...args) => mockGetCurrentUser(...args),
}));

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetCurrentUser.mockClear();
  });

  it("shows login when there is no token", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });

  it("loads profile label when token is present", async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "fake.jwt.token");
    localStorage.setItem(AUTH_ROLE_KEY, "user");
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Sam Member")).toBeInTheDocument();
    });
    await waitFor(() => expect(mockGetCurrentUser).toHaveBeenCalledTimes(1));
  });

  it("shows admin navigation when role is admin", async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, "fake.jwt.token");
    localStorage.setItem(AUTH_ROLE_KEY, "admin");
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /admin dashboard/i })).toBeInTheDocument();
    await waitFor(() => expect(mockGetCurrentUser).toHaveBeenCalledTimes(1));
  });
});
