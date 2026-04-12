jest.mock("../Components/WalkingManagement/services/osrmService", () => ({
  getWalkingDistanceKm: jest.fn(),
}));
jest.mock("../Components/WalkingManagement/models/Trip", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));
jest.mock("../Components/WalkingManagement/models/PointTransaction", () => ({
  create: jest.fn(),
}));
jest.mock("../Components/User/models/User", () => ({
  findByIdAndUpdate: jest.fn(),
}));

const { getWalkingDistanceKm } = require("../Components/WalkingManagement/services/osrmService");
const Trip = require("../Components/WalkingManagement/models/Trip");
const PointTransaction = require("../Components/WalkingManagement/models/PointTransaction");
const User = require("../Components/User/models/User");
const {
  createTrip,
  getTripsByUser,
  updateTrip,
  deleteTrip,
  endTrip,
} = require("../Components/WalkingManagement/controllers/tripController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("tripController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createTrip validates startLocation", async () => {
    const res = mockRes();
    await createTrip(
      {
        body: {
          userId: "u",
          startLocation: { lat: 1 },
          endLocation: { lat: 2, lng: 3 },
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createTrip returns estimate", async () => {
    getWalkingDistanceKm.mockResolvedValue(1.5);
    Trip.create.mockResolvedValue({
      _id: "trip1",
      userId: "u",
      startLocation: { lat: 1, lng: 2 },
      endLocation: { lat: 1.01, lng: 2.01 },
      estimatedDistanceKm: 1.5,
      status: "active",
    });
    const res = mockRes();
    await createTrip(
      {
        body: {
          userId: "u",
          startLocation: { lat: 1, lng: 2 },
          endLocation: { lat: 1.01, lng: 2.01 },
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        estimate: expect.objectContaining({ distanceKm: 1.5 }),
      })
    );
  });

  it("getTripsByUser requires userId", async () => {
    const res = mockRes();
    await getTripsByUser({ query: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updateTrip sets endedAt when completing", async () => {
    Trip.findByIdAndUpdate.mockResolvedValue({ _id: "t", status: "completed" });
    const res = mockRes();
    await updateTrip(
      { params: { id: "507f1f77bcf86cd799439011" }, body: { status: "completed" } },
      res
    );
    expect(Trip.findByIdAndUpdate).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      expect.objectContaining({ status: "completed", endedAt: expect.any(Date) }),
      expect.objectContaining({ new: true })
    );
  });

  it("endTrip rejects unrealistic distance", async () => {
    Trip.findById.mockResolvedValue({
      _id: "t",
      status: "active",
      userId: "u",
      startLocation: { lat: 0, lng: 0 },
      save: jest.fn().mockResolvedValue(true),
    });
    getWalkingDistanceKm.mockResolvedValue(40);
    const res = mockRes();
    await endTrip(
      {
        params: { id: "507f1f77bcf86cd799439011" },
        body: { endLocation: { lat: 1, lng: 1 } },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("unrealistic") })
    );
  });

  it("endTrip completes and awards points", async () => {
    const trip = {
      _id: "t",
      status: "active",
      userId: "507f1f77bcf86cd799439011",
      startLocation: { lat: 1, lng: 2 },
      save: jest.fn().mockResolvedValue(true),
    };
    Trip.findById.mockResolvedValue(trip);
    getWalkingDistanceKm.mockResolvedValue(5);
    PointTransaction.create.mockResolvedValue({ _id: "pt" });
    User.findByIdAndUpdate.mockResolvedValue({});
    const res = mockRes();
    await endTrip(
      {
        params: { id: "507f1f77bcf86cd799439011" },
        body: { endLocation: { lat: 1.01, lng: 2.01 } },
      },
      res
    );
    expect(PointTransaction.create).toHaveBeenCalled();
    expect(User.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
