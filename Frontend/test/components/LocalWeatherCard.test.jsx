import { render, screen, waitFor } from "@testing-library/react";
import LocalWeatherCard from "../../src/components/weather/LocalWeatherCard";

jest.mock("../../src/services/weather/weatherService", () => ({
  getLiveWeatherDetails: jest.fn(() =>
    Promise.resolve({
      locationName: "Testville",
      temperature: 21.4,
      description: "sunny",
      wind_speed: 3,
      humidity: 55,
      icon: "01d",
    })
  ),
}));

describe("LocalWeatherCard", () => {
  it("renders weather after fetch", async () => {
    render(<LocalWeatherCard />);
    expect(screen.getByText(/fetching weather/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/sunny/i)).toBeInTheDocument();
    });
    const section = screen.getByRole("heading", { name: /local conditions/i }).closest("section");
    expect(section).toHaveTextContent(/testville/i);
    expect(section).toHaveTextContent(/21/);
    expect(screen.getByAltText("weather")).toHaveAttribute(
      "src",
      expect.stringContaining("openweathermap.org")
    );
  });
});
