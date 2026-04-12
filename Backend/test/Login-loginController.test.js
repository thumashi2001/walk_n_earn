process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Components/User/models/User");
const { loginUser, registerUser } = require("../Components/Login/loginController");

jest.mock("../Components/User/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(() => "jwt-token"),
}));

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Login loginController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUser", () => {
    it("returns 404 when user not found", async () => {
      User.findOne.mockResolvedValue(null);
      const req = { body: { email: "nope@x.com", password: "x" } };
      const res = mockRes();
      await loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns 400 on wrong password", async () => {
      User.findOne.mockResolvedValue({ _id: "1", email: "a@b.com", passwordHash: "hash", role: "user" });
      bcrypt.compare.mockResolvedValue(false);
      const req = { body: { email: "a@b.com", password: "wrong" } };
      const res = mockRes();
      await loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns token on success", async () => {
      User.findOne.mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        email: "a@b.com",
        passwordHash: "hash",
        role: "user",
      });
      bcrypt.compare.mockResolvedValue(true);
      const req = { body: { email: "a@b.com", password: "ok" } };
      const res = mockRes();
      await loginUser(req, res);
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User logged in successfully",
          token: "jwt-token",
          role: "user",
        })
      );
    });
  });

  describe("registerUser", () => {
    it("returns 400 when email already exists", async () => {
      User.findOne.mockResolvedValue({ email: "a@b.com" });
      const req = { body: { fullName: "A", email: "a@b.com", password: "p" } };
      const res = mockRes();
      await registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("creates user and returns 201", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed");
      User.create.mockResolvedValue({
        _id: "newid",
        fullName: "New",
        email: "new@b.com",
        role: "user",
      });
      const req = { body: { fullName: "New", email: "new@b.com", password: "secret" } };
      const res = mockRes();
      await registerUser(req, res);
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
