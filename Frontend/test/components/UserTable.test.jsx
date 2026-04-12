import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserTable from "../../src/components/UserTable";

describe("UserTable", () => {
  const users = [
    { _id: "1", fullName: "Alice", email: "alice@example.com", totalPoints: 100, role: "user" },
    { _id: "2", fullName: "Bob Admin", email: "bob@example.com", totalPoints: 50, role: "admin" },
  ];

  it("filters by search query", async () => {
    const user = userEvent.setup();
    render(<UserTable users={users} loading={false} error="" />);
    const input = screen.getByPlaceholderText(/search by name or email/i);
    await user.type(input, "alice");
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob Admin")).not.toBeInTheDocument();
  });

  it("shows admin badge for admin role", () => {
    render(<UserTable users={users} loading={false} error="" />);
    expect(screen.getAllByText("Admin").length).toBeGreaterThanOrEqual(1);
  });
});
