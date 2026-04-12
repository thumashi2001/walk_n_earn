import { render, screen } from "@testing-library/react";
import RedemptionTable from "../../src/components/RedemptionTable";

describe("RedemptionTable", () => {
  it("shows loading state", () => {
    render(<RedemptionTable rows={[]} loading error="" />);
    expect(screen.getByText(/loading redemption history/i)).toBeInTheDocument();
  });

  it("shows error", () => {
    render(<RedemptionTable rows={[]} loading={false} error="Boom" />);
    expect(screen.getByText("Boom")).toBeInTheDocument();
  });

  it("shows empty copy", () => {
    render(<RedemptionTable rows={[]} loading={false} error="" />);
    expect(screen.getByText("No data.")).toBeInTheDocument();
  });

  it("renders rows", () => {
    render(
      <RedemptionTable
        rows={[
          {
            _id: "1",
            userName: "Ada",
            rewardName: "Mug",
            pointsUsed: 10,
            createdAt: "2024-01-15T00:00:00.000Z",
          },
        ]}
        loading={false}
        error=""
      />
    );
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Mug")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
