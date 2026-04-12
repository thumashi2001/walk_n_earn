import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRewardAdmin } from "../../src/services/rewards";
import RewardFormModal from "../../src/components/admin/RewardFormModal";

jest.mock("../../src/services/rewards", () => ({
  createRewardAdmin: jest.fn(() => Promise.resolve({ ok: true })),
  updateRewardAdmin: jest.fn(),
}));

jest.mock("../../src/services/auth", () => ({
  getAuthErrorMessage: jest.fn(() => "Error"),
}));

describe("RewardFormModal", () => {
  beforeEach(() => {
    createRewardAdmin.mockClear();
  });

  it("validates required title on submit", async () => {
    const user = userEvent.setup();
    render(<RewardFormModal open reward={null} onClose={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: /create reward/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(createRewardAdmin).not.toHaveBeenCalled();
  });

  it("submits valid payload for new reward", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<RewardFormModal open reward={null} onClose={onClose} />);
    await user.type(
      screen.getByPlaceholderText(/chocolate muffin voucher/i),
      "Muffin"
    );
    await user.type(document.getElementById("rw-image"), "https://example.com/a.png");
    await user.type(document.getElementById("rw-points"), "25");
    await user.type(document.getElementById("rw-qty"), "2");
    await user.click(screen.getByRole("button", { name: /create reward/i }));
    await waitFor(() => expect(createRewardAdmin).toHaveBeenCalled());
    expect(createRewardAdmin.mock.calls[0][0]).toMatchObject({
      title: "Muffin",
      pointsRequired: 25,
      quantity: 2,
      imageUrl: "https://example.com/a.png",
    });
    expect(onClose).toHaveBeenCalled();
  });
});
