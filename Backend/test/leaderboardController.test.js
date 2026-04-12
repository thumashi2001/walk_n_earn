jest.mock("../Components/Leaderboard/models/weeklyLeaderboard", () => ({
  findOneAndUpdate: jest.fn(),
  find: jest.fn(),
  aggregate: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

const mongoose = require("mongoose");
const WeeklyLeaderboard = require("../Components/Leaderboard/models/weeklyLeaderboard");
const leaderboardController = require("../Components/Leaderboard/controllers/leaderboardController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("leaderboardController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateWeeklyLeaderboard upserts weekly row", async () => {
    WeeklyLeaderboard.findOneAndUpdate.mockResolvedValue({});
    await leaderboardController.updateWeeklyLeaderboard(
      "507f1f77bcf86cd799439011",
      10,
      2,
      0.4
    );
    expect(WeeklyLeaderboard.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: expect.any(mongoose.Types.ObjectId),
        week_start: expect.any(Date),
      }),
      expect.objectContaining({
        $inc: { weekly_points: 10, weekly_distance: 2, weekly_emission: 0.4 },
      }),
      expect.objectContaining({ upsert: true, new: true })
    );
  });

  it("getTop10 returns aggregate result", async () => {
    WeeklyLeaderboard.aggregate.mockResolvedValue([{ userId: "1", weekly_points: 50 }]);
    const res = mockRes();
    await leaderboardController.getTop10({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ userId: "1", weekly_points: 50 }]);
  });

  it("getUserRank returns 404 when user not in list", async () => {
    WeeklyLeaderboard.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });
    const res = mockRes();
    await leaderboardController.getUserRank({ params: { userId: "missing" } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getUserRank returns rank", async () => {
    WeeklyLeaderboard.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { user_id: { toString: () => "a" }, weekly_points: 10 },
        { user_id: { toString: () => "b" }, weekly_points: 5 },
      ]),
    });
    const res = mockRes();
    await leaderboardController.getUserRank({ params: { userId: "b" } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "b", rank: 2, weekly_points: 5 })
    );
  });
});
