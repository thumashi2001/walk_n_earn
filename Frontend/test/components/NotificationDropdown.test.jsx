import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationDropdown from "../../src/components/NotificationDropdown";

describe("NotificationDropdown", () => {
  it("returns null when closed", () => {
    const { container } = render(
      <NotificationDropdown
        open={false}
        notifications={[]}
        onMarkRead={jest.fn()}
        onMarkAllRead={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("lists notifications and wires actions", async () => {
    const user = userEvent.setup();
    const onMarkRead = jest.fn();
    const onMarkAllRead = jest.fn();
    const onClose = jest.fn();
    const notifications = [
      {
        id: "1",
        message: "Hello",
        timestamp: Date.now(),
        type: "reward",
        read: false,
      },
    ];
    render(
      <NotificationDropdown
        open
        notifications={notifications}
        onMarkRead={onMarkRead}
        onMarkAllRead={onMarkAllRead}
        onClose={onClose}
      />
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /mark all read/i }));
    expect(onMarkAllRead).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /close notifications/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows empty state", () => {
    render(
      <NotificationDropdown
        open
        notifications={[]}
        onMarkRead={jest.fn()}
        onMarkAllRead={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText(/no notifications yet/i)).toBeInTheDocument();
  });
});
