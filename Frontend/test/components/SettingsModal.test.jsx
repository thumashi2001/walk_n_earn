import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsModal from "../../src/components/SettingsModal";

describe("SettingsModal", () => {
  beforeEach(() => {
    localStorage.removeItem("notificationsEnabled");
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <SettingsModal open={false} onClose={jest.fn()} onLogout={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders settings shell and triggers logout", async () => {
    const user = userEvent.setup();
    const onLogout = jest.fn();
    const onClose = jest.fn();
    render(<SettingsModal open onClose={onClose} onLogout={onLogout} />);
    expect(screen.getByRole("heading", { name: /settings/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^logout$/i }));
    expect(onLogout).toHaveBeenCalled();
  });
});
