import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileCard from "../../src/components/ProfileCard";

describe("ProfileCard", () => {
  const baseUser = {
    fullName: "Casey Walker",
    email: "casey@example.com",
    totalPoints: 42,
    totalDistance: 12,
    totalCO2Saved: 3,
  };

  it("renders user stats and location", () => {
    render(
      <ProfileCard
        user={baseUser}
        role="user"
        avatarPreview=""
        onAvatarChange={jest.fn()}
        locationText="Colombo"
        loggingOut={false}
        onLogout={jest.fn()}
      />
    );
    expect(screen.getByText("Casey Walker")).toBeInTheDocument();
    expect(screen.getByText(/colombo/i)).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows admin chip when role is admin", () => {
    render(
      <ProfileCard
        user={baseUser}
        role="admin"
        avatarPreview=""
        onAvatarChange={jest.fn()}
        locationText="—"
        loggingOut={false}
        onLogout={jest.fn()}
      />
    );
    expect(screen.getAllByText("Admin").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onLogout", async () => {
    const user = userEvent.setup();
    const onLogout = jest.fn();
    render(
      <ProfileCard
        user={baseUser}
        role="user"
        avatarPreview=""
        onAvatarChange={jest.fn()}
        locationText="X"
        loggingOut={false}
        onLogout={onLogout}
      />
    );
    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(onLogout).toHaveBeenCalled();
  });
});
