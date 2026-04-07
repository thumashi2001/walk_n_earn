/**
 * Reward Controller Tests
 * Covers: unit tests (mocked mongoose) + integration tests (mongodb-memory-server)
 */

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// ─── Models ────────────────────────────────────────────────────────────────────
const Reward = require("../models/Reward");
const Redemption = require("../models/Redemption");
const User = require("../../User/models/User");

// ─── Helper: build mock req / res ──────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── Unit Tests (mocked mongoose) ─────────────────────────────────────────────
describe("Reward Controller — Unit Tests", () => {
  let createReward, getRewards, getActiveRewards, updateReward, deleteReward, redeemReward;

  beforeAll(() => {
    jest.mock("../models/Reward");
    jest.mock("../models/Redemption");
    jest.mock("../../User/models/User");
    jest.mock("../../../utils/emailService", () => ({
      sendVoucherEmail: jest.fn().mockResolvedValue(undefined),
    }));

    ({
      createReward,
      getRewards,
      getActiveRewards,
      updateReward,
      deleteReward,
      redeemReward,
    } = require("../controllers/rewardController"));
  });

  afterEach(() => jest.clearAllMocks());

  // ── createReward ──────────────────────────────────────────────────────────
  describe("createReward", () => {
    it("returns 201 with created reward", async () => {
      const newReward = { _id: "r1", title: "Coffee Voucher", pointsRequired: 100 };
      Reward.create = jest.fn().mockResolvedValue(newReward);

      const req = { body: { title: "Coffee Voucher", pointsRequired: 100 } };
      const res = mockRes();

      await createReward(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newReward);
    });

    it("returns 500 on DB error", async () => {
      Reward.create = jest.fn().mockRejectedValue(new Error("DB error"));

      const req = { body: {} };
      const res = mockRes();

      await createReward(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ── getRewards ────────────────────────────────────────────────────────────
  describe("getRewards", () => {
    it("returns all rewards with 200", async () => {
      const rewards = [{ title: "R1" }, { title: "R2" }];
      Reward.find = jest.fn().mockResolvedValue(rewards);

      const req = {};
      const res = mockRes();

      await getRewards(req, res);

      expect(res.json).toHaveBeenCalledWith(rewards);
    });
  });

  // ── getActiveRewards ──────────────────────────────────────────────────────
  describe("getActiveRewards", () => {
    it("calls find with isActive:true and returns results", async () => {
      const active = [{ title: "Active R", isActive: true }];
      Reward.find = jest.fn().mockResolvedValue(active);

      const req = {};
      const res = mockRes();

      await getActiveRewards(req, res);

      expect(Reward.find).toHaveBeenCalledWith({ isActive: true });
      expect(res.json).toHaveBeenCalledWith(active);
    });
  });

  // ── updateReward ──────────────────────────────────────────────────────────
  describe("updateReward", () => {
    it("returns 404 when reward not found", async () => {
      Reward.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const req = { params: { id: "nonexistent" }, body: { quantity: 5 } };
      const res = mockRes();

      await updateReward(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns updated reward on success", async () => {
      const updated = { _id: "r1", title: "Updated", pointsRequired: 200 };
      Reward.findByIdAndUpdate = jest.fn().mockResolvedValue(updated);

      const req = { params: { id: "r1" }, body: { pointsRequired: 200 } };
      const res = mockRes();

      await updateReward(req, res);

      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  // ── deleteReward ──────────────────────────────────────────────────────────
  describe("deleteReward", () => {
    it("returns 404 when reward not found", async () => {
      Reward.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const req = { params: { id: "nonexistent" } };
      const res = mockRes();

      await deleteReward(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns success message on delete", async () => {
      Reward.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "r1" });

      const req = { params: { id: "r1" } };
      const res = mockRes();

      await deleteReward(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Reward deleted" });
    });
  });

  // ── redeemReward ──────────────────────────────────────────────────────────
  describe("redeemReward", () => {
    it("returns 403 when an admin tries to redeem", async () => {
      const req = {
        user: { _id: "u1", role: "admin" },
        body: { rewardId: "r1" },
      };
      const res = mockRes();

      await redeemReward(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("returns 400 when user has insufficient points", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "u1", totalPoints: 50 });
      Reward.findById = jest.fn().mockResolvedValue({ _id: "r1", pointsRequired: 200, quantity: 10 });

      const req = { user: { _id: "u1", role: "user" }, body: { rewardId: "r1" } };
      const res = mockRes();

      await redeemReward(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Not Enough Points" });
    });

    it("returns 400 when reward is out of stock", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "u1", totalPoints: 500 });
      Reward.findById = jest.fn().mockResolvedValue({ _id: "r1", pointsRequired: 100, quantity: 0 });

      const req = { user: { _id: "u1", role: "user" }, body: { rewardId: "r1" } };
      const res = mockRes();

      await redeemReward(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Out of stock" });
    });

    it("returns 404 when user or reward not found", async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      Reward.findById = jest.fn().mockResolvedValue(null);

      const req = { user: { _id: "uid", role: "user" }, body: { rewardId: "rid" } };
      const res = mockRes();

      await redeemReward(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("redeems successfully, deducts points, and generates voucher", async () => {
      const user = {
        _id: "u1",
        email: "user@test.com",
        totalPoints: 300,
        role: "user",
        save: jest.fn().mockResolvedValue(true),
      };
      const reward = {
        _id: "r1",
        title: "Coffee",
        pointsRequired: 100,
        quantity: 5,
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById = jest.fn().mockResolvedValue(user);
      Reward.findById = jest.fn().mockResolvedValue(reward);
      Redemption.create = jest.fn().mockResolvedValue({
        _id: "red1",
        userId: "u1",
        rewardId: "r1",
        voucherCode: "VOUCHER-ABCD1234",
        pointsUsed: 100,
      });

      const req = { user: { _id: "u1", role: "user" }, body: { rewardId: "r1" } };
      const res = mockRes();

      await redeemReward(req, res);

      expect(user.totalPoints).toBe(200);
      expect(reward.quantity).toBe(4);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Redeemed Successfully. Voucher sent to email!" })
      );
    });
  });
});

// ─── Integration Tests (real in-memory MongoDB) ────────────────────────────────
describe("Reward Controller — Integration Tests", () => {
  let mongoServer;
  let testUser, testReward;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    jest.resetModules();
    jest.unmock("../models/Reward");
    jest.unmock("../models/Redemption");
    jest.unmock("../../User/models/User");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    testUser = await User.create({
      fullName: "Integration User",
      email: "integ@test.com",
      passwordHash: "hashed",
      totalPoints: 500,
    });

    testReward = await Reward.create({
      title: "Test Voucher",
      description: "A test reward",
      pointsRequired: 100,
      quantity: 10,
      isActive: true,
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Reward.deleteMany({});
    await Redemption.deleteMany({});
  });

  it("getActiveRewards returns only active rewards from DB", async () => {
    await Reward.create({
      title: "Inactive Reward",
      pointsRequired: 50,
      quantity: 5,
      isActive: false,
    });

    const { getActiveRewards } = require("../controllers/rewardController");
    const req = {};
    const res = mockRes();

    await getActiveRewards(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.every((r) => r.isActive === true)).toBe(true);
    expect(result.length).toBe(1);
  });

  it("full redemption flow: deducts points, decrements quantity, creates Redemption record", async () => {
    jest.mock("../../../utils/emailService", () => ({
      sendVoucherEmail: jest.fn().mockResolvedValue(undefined),
    }));
    const { redeemReward } = require("../controllers/rewardController");

    const req = {
      user: { _id: testUser._id, role: "user" },
      body: { rewardId: testReward._id.toString() },
    };
    const res = mockRes();

    await redeemReward(req, res);

    const updatedUser = await User.findById(testUser._id);
    const updatedReward = await Reward.findById(testReward._id);
    const redemption = await Redemption.findOne({ userId: testUser._id });

    expect(updatedUser.totalPoints).toBe(400);
    expect(updatedReward.quantity).toBe(9);
    expect(redemption).not.toBeNull();
    expect(redemption.voucherCode).toMatch(/^VOUCHER-/);
  });

  it("getUserRedemptions returns populated redemption history", async () => {
    await Redemption.create({
      userId: testUser._id,
      rewardId: testReward._id,
      pointsUsed: 100,
      voucherCode: "VOUCHER-TEST1234",
    });

    const { getUserRedemptions } = require("../controllers/rewardController");

    const req = { user: { _id: testUser._id } };
    const res = mockRes();

    await getUserRedemptions(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.length).toBe(1);
    expect(result[0].rewardId.title).toBe("Test Voucher");
    expect(result[0].voucherCode).toBe("VOUCHER-TEST1234");
  });
});
