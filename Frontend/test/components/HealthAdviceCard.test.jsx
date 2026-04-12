import { render, screen, waitFor } from "@testing-library/react";
import HealthAdviceCard from "../../src/components/weather/HealthAdviceCard";

jest.mock("../../src/services/weather/healthService", () => ({
  getMatchingHealthAdvice: jest.fn(() =>
    Promise.resolve([
      {
        _id: "a1",
        title: "Hydrate",
        advice: "Drink water.",
        category: "Temperature",
        severity: "Normal",
        priority: 1,
      },
    ])
  ),
}));

describe("HealthAdviceCard", () => {
  it("renders advice rows after loading", async () => {
    render(<HealthAdviceCard />);
    await waitFor(() => {
      expect(screen.getByText("Hydrate")).toBeInTheDocument();
    });
    expect(screen.getByText("Drink water.")).toBeInTheDocument();
  });
});
