import { render, screen } from "@testing-library/react";
import AppFooter from "../../src/components/AppFooter";

describe("AppFooter", () => {
  it("renders footer copy", () => {
    render(<AppFooter />);
    expect(
      screen.getByText(/Walk n Earn • Eco friendly walking rewards platform/i)
    ).toBeInTheDocument();
  });
});
