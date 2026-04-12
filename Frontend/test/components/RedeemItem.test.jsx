import { render, screen } from "@testing-library/react";
import RedeemItem from "../../src/components/RedeemItem";

describe("RedeemItem", () => {
  it("renders reward name and points spent", () => {
    render(
      <RedeemItem
        item={{ name: "Coffee voucher", date: "2024-05-10", points: 120 }}
      />
    );
    expect(screen.getByText("Coffee voucher")).toBeInTheDocument();
    expect(screen.getByText("-120 pts")).toBeInTheDocument();
  });
});
