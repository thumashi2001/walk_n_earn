import { render, screen } from "@testing-library/react";
import FormAlert from "../../src/components/auth/FormAlert";

describe("FormAlert", () => {
  it("renders error variant by default", () => {
    render(<FormAlert>Something failed</FormAlert>);
    const el = screen.getByRole("alert");
    expect(el).toHaveTextContent("Something failed");
  });

  it("supports success variant and custom role", () => {
    render(
      <FormAlert variant="success" role="status">
        Done
      </FormAlert>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Done");
  });
});
