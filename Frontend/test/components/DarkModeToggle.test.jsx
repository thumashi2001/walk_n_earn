import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DarkModeToggle from "../../src/components/DarkModeToggle";

describe("DarkModeToggle", () => {
  beforeEach(() => {
    localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
  });

  it("toggles theme in localStorage when clicked", async () => {
    const user = userEvent.setup();
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    render(<DarkModeToggle />);
    const btn = screen.getByRole("button", { name: /dark mode/i });
    await user.click(btn);
    expect(localStorage.getItem("theme")).toBe("dark");
    await user.click(screen.getByRole("button", { name: /light mode/i }));
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
