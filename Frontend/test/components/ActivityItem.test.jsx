import { render, screen } from "@testing-library/react";
import ActivityItem from "../../src/components/ActivityItem";

describe("ActivityItem", () => {
  it("renders distance and points", () => {
    render(
      <ActivityItem
        item={{ date: "2024-06-01", distanceKm: 3.2, points: 50 }}
      />
    );
    expect(screen.getByText("3.2 km")).toBeInTheDocument();
    expect(screen.getByText("+50 pts")).toBeInTheDocument();
  });
});
