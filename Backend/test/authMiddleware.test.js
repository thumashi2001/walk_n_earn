process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

const jwt = require("jsonwebtoken");
const User = require("../Components/User/models/User");
const authMiddleware = require("../middleware/authMiddleware");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(() => "signed-token"),
}));
jest.mock("../Components/User/models/User", () => ({
  findById: jest.fn(),
}));

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when Authorization token is missing", async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
  });

  it("returns 404 when user is not in database", async () => {
    jwt.verify.mockReturnValue({ id: "507f1f77bcf86cd799439011" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const req = { headers: { authorization: "Bearer valid.jwt" } };
    const res = mockRes();
    const next = jest.fn();
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("attaches user and calls next on success", async () => {
    const userDoc = { _id: "507f1f77bcf86cd799439011", email: "a@b.com" };
    jwt.verify.mockReturnValue({ id: userDoc._id });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(userDoc),
    });
    const req = { headers: { authorization: "Bearer valid.jwt" } };
    const res = mockRes();
    const next = jest.fn();
    await authMiddleware(req, res, next);
    expect(req.user).toBe(userDoc);
    expect(next).toHaveBeenCalled();
  });

  it("returns 401 on invalid token", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("bad");
    });
    const req = { headers: { authorization: "Bearer x" } };
    const res = mockRes();
    const next = jest.fn();
    await authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
