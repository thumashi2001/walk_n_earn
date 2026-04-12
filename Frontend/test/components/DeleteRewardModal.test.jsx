import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { deleteRewardAdmin } from "../../src/services/rewards";
import DeleteRewardModal from "../../src/components/admin/DeleteRewardModal";

jest.mock("../../src/services/rewards", () => ({
  deleteRewardAdmin: jest.fn(() => Promise.resolve({})),
}));

jest.mock("../../src/services/auth", () => ({
  getAuthErrorMessage: jest.fn(() => "Auth copy"),
}));

describe("DeleteRewardModal", () => {
  beforeEach(() => {
    deleteRewardAdmin.mockClear();
  });

  it("does not render when closed", () => {
    render(
      <DeleteRewardModal
        open={false}
        reward={{ _id: "1", title: "X" }}
        onClose={jest.fn()}
        onDeleted={jest.fn()}
      />
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("deletes reward and closes", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onDeleted = jest.fn();
    render(
      <DeleteRewardModal
        open
        reward={{ _id: "rid", title: "Gift card" }}
        onClose={onClose}
        onDeleted={onDeleted}
      />
    );
    expect(screen.getByText(/gift card/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    await waitFor(() => expect(deleteRewardAdmin).toHaveBeenCalledWith("rid"));
    expect(onDeleted).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
