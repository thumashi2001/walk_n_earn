process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Components/User/models/User");
const {
  registerUser,
  loginUser,
  getUserById,
  getCurrentUser,
  listUsers,
} = require("../Components/User/controllers/userController");

jest.mock("../Components/User/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
}));
jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(() => "user-jwt"),
}));

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("User userController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registerUser validates required fields", async () => {
    const res = mockRes();
    await registerUser({ body: { fullName: "", email: "", password: "" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("loginUser rejects missing credentials", async () => {
    const res = mockRes();
    await loginUser({ body: { email: "", password: "" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getUserById returns 404 when missing", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const res = mockRes();
    await getUserById({ params: { id: "507f1f77bcf86cd799439011" } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getCurrentUser returns 401 without req.user", async () => {
    const res = mockRes();
    await getCurrentUser({ user: null }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("getCurrentUser returns user payload", async () => {
    const res = mockRes();
    const user = {
      _id: "1",
      fullName: "Sam",
      email: "sam@x.com",
      role: "user",
      totalPoints: 10,
      totalCo2SavedKg: 1,
      totalDistanceKm: 2,
    };
    await getCurrentUser({ user }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: expect.objectContaining({ fullName: "Sam", email: "sam@x.com" }),
    });
  });

  it("listUsers returns array", async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ _id: "1", fullName: "A" }]),
      }),
    });
    const res = mockRes();
    await listUsers({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ _id: "1", fullName: "A" }]);
  });
});
