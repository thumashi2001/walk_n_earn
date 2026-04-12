jest.mock("../Components/RewardAndPoints/models/Reward", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));
jest.mock("../Components/RewardAndPoints/models/Redemption", () => ({
  create: jest.fn(),
  find: jest.fn(),
}));
jest.mock("../Components/User/models/User", () => ({
  findById: jest.fn(),
}));
jest.mock("../utils/emailService", () => ({
  sendVoucherEmail: jest.fn(),
}));

const Reward = require("../Components/RewardAndPoints/models/Reward");
const Redemption = require("../Components/RewardAndPoints/models/Redemption");
const {
  createReward,
  getRewards,
  redeemReward,
  getRedemptions,
} = require("../Components/RewardAndPoints/controllers/rewardController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("rewardController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createReward rejects empty title", async () => {
    const res = mockRes();
    await createReward(
      {
        body: {
          title: "   ",
          imageUrl: "https://example.com/x.png",
          pointsRequired: 1,
          quantity: 0,
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(Reward.create).not.toHaveBeenCalled();
  });

  it("createReward rejects invalid image URL", async () => {
    const res = mockRes();
    await createReward(
      {
        body: {
          title: "Gift",
          imageUrl: "ftp://bad",
          pointsRequired: 1,
          quantity: 1,
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getRewards maps list", async () => {
    Reward.find.mockResolvedValue([{ title: "A", imageUrl: "", image: "https://x.com/i.png" }]);
    const res = mockRes();
    await getRewards({}, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ title: "A", imageUrl: "https://x.com/i.png" })])
    );
  });

  it("redeemReward rejects admin role", async () => {
    const res = mockRes();
    await redeemReward({ user: { role: "admin", _id: "1" }, body: { rewardId: "r" } }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("getRedemptions returns rows", async () => {
    Redemption.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([
            {
              _id: "1",
              userId: { fullName: "Ada" },
              rewardId: { title: "Mug" },
              pointsUsed: 5,
              createdAt: new Date("2024-01-01"),
            },
          ]),
        }),
      }),
    });
    const res = mockRes();
    await getRedemptions({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ userName: "Ada", rewardName: "Mug", pointsUsed: 5 }),
      ])
    );
  });
});
