import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationBell from "../../src/components/NotificationBell";

describe("NotificationBell", () => {
  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<NotificationBell unreadCount={0} onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: /open notifications/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
