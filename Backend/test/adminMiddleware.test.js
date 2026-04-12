const adminMiddleware = require("../middleware/adminMiddleware");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("adminMiddleware", () => {
  it("returns 401 when req.user is missing", () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when user is not admin", () => {
    const req = { user: { role: "user" } };
    const res = mockRes();
    const next = jest.fn();
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next for admin", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = jest.fn();
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
