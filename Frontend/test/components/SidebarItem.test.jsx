import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SidebarItem from "../../src/components/SidebarItem";

describe("SidebarItem", () => {
  it("invokes onClick and respects aria-label override", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <SidebarItem
        label="Home"
        icon="🏠"
        active={false}
        onClick={onClick}
        ariaLabel="Go home"
      />
    );
    await user.click(screen.getByRole("button", { name: "Go home" }));
    expect(onClick).toHaveBeenCalled();
  });
});
