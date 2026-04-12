const swaggerDocument = require("../config/swagger");

describe("swagger config", () => {
  it("exports OpenAPI document basics", () => {
    expect(swaggerDocument.openapi).toBe("3.0.0");
    expect(swaggerDocument.info.title).toContain("Walk");
    expect(swaggerDocument.paths).toBeDefined();
  });
});
