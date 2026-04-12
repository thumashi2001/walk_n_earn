import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redeemReward } from "../../src/services/rewards";
import RewardCard from "../../src/components/RewardCard";

jest.mock("../../src/services/rewards", () => ({
  redeemReward: jest.fn(() =>
    Promise.resolve({
      redemption: { voucherCode: "CODE123" },
      emailSent: false,
    })
  ),
  getRedeemErrorMessage: jest.fn(() => "Redeem failed"),
}));

jest.mock("../../src/utils/notifications", () => ({
  prependUserNotification: jest.fn(),
}));

describe("RewardCard", () => {
  const reward = {
    _id: "r1",
    title: "Sticker pack",
    description: "Fun stickers",
    pointsRequired: 10,
    quantity: 5,
    imageUrl: "https://example.com/img.png",
  };

  beforeEach(() => {
    redeemReward.mockClear();
  });

  it("renders reward details", () => {
    render(<RewardCard reward={reward} />);
    expect(screen.getByText("Sticker pack")).toBeInTheDocument();
    expect(screen.getByText("Fun stickers")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /redeem/i })).toBeInTheDocument();
  });

  it("redeems and shows success copy", async () => {
    const user = userEvent.setup();
    const onRedeemed = jest.fn();
    render(<RewardCard reward={reward} onRedeemed={onRedeemed} />);
    await user.click(screen.getByRole("button", { name: /redeem/i }));
    await waitFor(() => {
      expect(redeemReward).toHaveBeenCalledWith("r1");
    });
    expect(onRedeemed).toHaveBeenCalled();
    expect(
      screen.getByText(/reward redeemed! your voucher code is in the notification bell/i)
    ).toBeInTheDocument();
  });
});
