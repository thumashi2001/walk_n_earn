jest.mock("../Components/Leaderboard/controllers/leaderboardController", () => ({
  updateWeeklyLeaderboard: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../Components/WalkingManagement/models/PointTransaction", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const PointTransaction = require("../Components/WalkingManagement/models/PointTransaction");
const { updateWeeklyLeaderboard } = require("../Components/Leaderboard/controllers/leaderboardController");
const {
  createPointsFromTrip,
  getPointsByUser,
  updatePointTransaction,
  deletePointTransaction,
} = require("../Components/WalkingManagement/controllers/pointsController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("pointsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createPointsFromTrip rejects invalid distanceKm", async () => {
    const res = mockRes();
    await createPointsFromTrip(
      { body: { userId: "u", tripId: "t", distanceKm: -1 } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(PointTransaction.create).not.toHaveBeenCalled();
  });

  it("createPointsFromTrip creates transaction and updates leaderboard", async () => {
    PointTransaction.create.mockResolvedValue({
      _id: "tx",
      userId: "u",
      pointsEarned: 4,
      co2SavedKg: 0.4,
      distanceKm: 2,
    });
    const res = mockRes();
    await createPointsFromTrip(
      { body: { userId: "507f1f77bcf86cd799439011", tripId: "507f191e810c19729de860ea", distanceKm: 2 } },
      res
    );
    expect(PointTransaction.create).toHaveBeenCalled();
    expect(updateWeeklyLeaderboard).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("getPointsByUser requires userId", async () => {
    const res = mockRes();
    await getPointsByUser({ query: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getPointsByUser aggregates totals", async () => {
    PointTransaction.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { distanceKm: 1, co2SavedKg: 0.2, pointsEarned: 2 },
        { distanceKm: 2, co2SavedKg: 0.4, pointsEarned: 4 },
      ]),
    });
    const res = mockRes();
    await getPointsByUser({ query: { userId: "u" } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totals: expect.objectContaining({
          totalDistanceKm: 3,
          totalPoints: 6,
        }),
      })
    );
  });

  it("updatePointTransaction returns 404 when missing", async () => {
    PointTransaction.findByIdAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await updatePointTransaction(
      { params: { id: "507f1f77bcf86cd799439011" }, body: { note: "x" } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("deletePointTransaction returns 404 when missing", async () => {
    PointTransaction.findByIdAndDelete.mockResolvedValue(null);
    const res = mockRes();
    await deletePointTransaction({ params: { id: "507f1f77bcf86cd799439011" } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
