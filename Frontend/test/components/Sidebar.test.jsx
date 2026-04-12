import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "../../src/components/Sidebar";

describe("Sidebar", () => {
  it("calls onNavigate and onOpenSettings for actions", async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();
    const onOpenSettings = jest.fn();
    render(
      <Sidebar
        activeKey="home"
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
      />
    );
    await user.click(screen.getByRole("button", { name: /profile/i }));
    expect(onNavigate).toHaveBeenCalledWith("/profile");
    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(onOpenSettings).toHaveBeenCalled();
  });
});
