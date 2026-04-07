/**
 * Leaderboard Controller Tests
 * Covers: unit tests (mocked mongoose) + integration tests (mongodb-memory-server)
 */

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// ─── Models ────────────────────────────────────────────────────────────────────
const WeeklyLeaderboard = require("../models/weeklyLeaderboard");
const User = require("../../User/models/User");

// ─── Helper: build mock req / res ──────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── Unit Tests (mocked mongoose) ─────────────────────────────────────────────
describe("Leaderboard Controller — Unit Tests", () => {
  let getTop10, getUserRank, adminUpdateWeeklyPoints, deleteWeeklyRecord;

  beforeAll(() => {
    // Import AFTER we can mock modules
    jest.mock("../models/weeklyLeaderboard");
    ({
      getTop10,
      getUserRank,
      adminUpdateWeeklyPoints,
      deleteWeeklyRecord,
    } = require("../controllers/leaderboardController"));
  });

  afterEach(() => jest.clearAllMocks());

  // ── getTop10 ──────────────────────────────────────────────────────────────
  describe("getTop10", () => {
    it("returns 200 with leaderboard data", async () => {
      const mockData = [
        { _id: "id1", weekly_points: 500, weekly_distance: 10, weekly_emission: 2, name: "Alice" },
      ];
      WeeklyLeaderboard.aggregate = jest.fn().mockResolvedValue(mockData);

      const req = {};
      const res = mockRes();

      await getTop10(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("returns 500 when aggregate throws", async () => {
      WeeklyLeaderboard.aggregate = jest.fn().mockRejectedValue(new Error("DB error"));

      const req = {};
      const res = mockRes();

      await getTop10(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to fetch leaderboard" })
      );
    });
  });

  // ── getUserRank ───────────────────────────────────────────────────────────
  describe("getUserRank", () => {
    it("returns 404 when user is not on the leaderboard", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      WeeklyLeaderboard.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      const req = { params: { userId } };
      const res = mockRes();

      await getUserRank(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns correct rank for a user present in leaderboard", async () => {
      const userId = new mongoose.Types.ObjectId();
      const entries = [
        { user_id: new mongoose.Types.ObjectId(), weekly_points: 600 },
        { user_id: userId, weekly_points: 400, weekly_distance: 8, weekly_emission: 1.5 },
        { user_id: new mongoose.Types.ObjectId(), weekly_points: 300 },
      ];
      WeeklyLeaderboard.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(entries),
      });

      const req = { params: { userId: userId.toString() } };
      const res = mockRes();

      await getUserRank(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const payload = res.json.mock.calls[0][0];
      expect(payload.rank).toBe(2);
      expect(payload.weekly_points).toBe(400);
    });
  });

  // ── adminUpdateWeeklyPoints ───────────────────────────────────────────────
  describe("adminUpdateWeeklyPoints", () => {
    it("returns 404 when leaderboard record does not exist", async () => {
      WeeklyLeaderboard.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const req = { body: { userId: "uid", weekStart: "2024-01-01", newPoints: 100 } };
      const res = mockRes();

      await adminUpdateWeeklyPoints(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns updated record on success", async () => {
      const updated = { _id: "id1", weekly_points: 100 };
      WeeklyLeaderboard.findOneAndUpdate = jest.fn().mockResolvedValue(updated);

      const req = { body: { userId: "uid", weekStart: "2024-01-01", newPoints: 100 } };
      const res = mockRes();

      await adminUpdateWeeklyPoints(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  // ── deleteWeeklyRecord ────────────────────────────────────────────────────
  describe("deleteWeeklyRecord", () => {
    it("returns 200 and success message on delete", async () => {
      WeeklyLeaderboard.findOneAndDelete = jest.fn().mockResolvedValue({});

      const req = { body: { userId: "uid", weekStart: "2024-01-01" } };
      const res = mockRes();

      await deleteWeeklyRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Record deleted successfully" });
    });

    it("returns 500 when delete throws", async () => {
      WeeklyLeaderboard.findOneAndDelete = jest.fn().mockRejectedValue(new Error("DB error"));

      const req = { body: { userId: "uid", weekStart: "2024-01-01" } };
      const res = mockRes();

      await deleteWeeklyRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

// ─── Integration Tests (real in-memory MongoDB) ────────────────────────────────
describe("Leaderboard Controller — Integration Tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    // Reset module registry so real models are used (not mocked)
    jest.resetModules();
    jest.unmock("../models/weeklyLeaderboard");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await WeeklyLeaderboard.deleteMany({});
    await User.deleteMany({});
  });

  // ── DB interaction: upsert + top10 ──────────────────────────────────────
  it("upserts a leaderboard entry and retrieves it in top 10", async () => {
    // Re-import after resetModules to get un-mocked versions
    const { updateWeeklyLeaderboard } = require("../controllers/leaderboardController");

    const user = await User.create({
      fullName: "Test User",
      email: "test@example.com",
      passwordHash: "hashed",
    });

    // Call upsert twice – points should accumulate
    await updateWeeklyLeaderboard(user._id.toString(), 100, 2.5, 0.5);
    await updateWeeklyLeaderboard(user._id.toString(), 50, 1.0, 0.2);

    const entry = await WeeklyLeaderboard.findOne({ user_id: user._id });
    expect(entry).not.toBeNull();
    expect(entry.weekly_points).toBe(150);
    expect(entry.weekly_distance).toBeCloseTo(3.5);
  });

  it("returns an empty array for getTop10 when no data exists for current week", async () => {
    const { getTop10 } = require("../controllers/leaderboardController");

    const req = {};
    const res = mockRes();
    await getTop10(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("ranks multiple users correctly", async () => {
    const { updateWeeklyLeaderboard, getTop10 } = require(
      "../controllers/leaderboardController"
    );

    const alice = await User.create({ fullName: "Alice", email: "alice@test.com", passwordHash: "h" });
    const bob = await User.create({ fullName: "Bob", email: "bob@test.com", passwordHash: "h" });

    await updateWeeklyLeaderboard(alice._id.toString(), 300, 6, 1.2);
    await updateWeeklyLeaderboard(bob._id.toString(), 500, 9, 2.0);

    const req = {};
    const res = mockRes();
    await getTop10(req, res);

    const board = res.json.mock.calls[0][0];
    expect(board.length).toBe(2);
    // Bob has more points → rank 1
    expect(board[0].weekly_points).toBe(500);
    expect(board[0].name).toBe("Bob");
  });
});
