const { validateLogin } = require("../Components/Login/loginMiddleware");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("validateLogin (Login component)", () => {
  it("returns 400 when email or password missing", () => {
    const res = mockRes();
    const next = jest.fn();
    validateLogin({ body: { email: "", password: "x" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when both present", () => {
    const res = mockRes();
    const next = jest.fn();
    validateLogin({ body: { email: "a@b.com", password: "secret" } }, res, next);
    expect(next).toHaveBeenCalled();
  });
});
