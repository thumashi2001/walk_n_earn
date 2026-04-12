import {
  authInputClassName,
  authLabelClassName,
} from "../../src/components/auth/authFieldStyles";

describe("authFieldStyles", () => {
  it("exports non-empty shared class strings", () => {
    expect(authInputClassName).toContain("rounded-2xl");
    expect(authLabelClassName).toContain("text-sm");
  });
});
