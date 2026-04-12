import { render, screen } from "@testing-library/react";
import BadgeCard from "../../src/components/BadgeCard";

describe("BadgeCard", () => {
  it("renders title and optional subtitle", () => {
    render(
      <BadgeCard icon="🏅" title="Gold" subtitle="10 walks" />
    );
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText("10 walks")).toBeInTheDocument();
    expect(screen.getByText("🏅")).toBeInTheDocument();
  });

  it("omits subtitle when not provided", () => {
    render(<BadgeCard icon="⭐" title="Only title" />);
    expect(screen.queryByText("10 walks")).not.toBeInTheDocument();
  });
});
