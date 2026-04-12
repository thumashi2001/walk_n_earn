jest.mock("../Components/Weather/admin/models/HealthAdvice", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const HealthAdvice = require("../Components/Weather/admin/models/HealthAdvice");
const {
  createHealthAdvice,
  getAllHealthAdvices,
} = require("../Components/Weather/admin/controllers/healthAdviceController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const validBody = () => ({
  title: "Hydrate",
  advice: "Drink water",
  category: "Temperature",
  severity: "Normal",
  priority: 2,
  trigger: {
    parameter: "Temperature",
    conditionType: "RANGE",
    range: { min: 25, max: 35 },
  },
});

describe("healthAdviceController (admin)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createHealthAdvice returns validation errors", async () => {
    const res = mockRes();
    await createHealthAdvice({ body: { title: "" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, errors: expect.any(Array) })
    );
    expect(HealthAdvice.create).not.toHaveBeenCalled();
  });

  it("createHealthAdvice persists valid payload", async () => {
    HealthAdvice.create.mockResolvedValue({ _id: "1", ...validBody() });
    const res = mockRes();
    await createHealthAdvice({ body: validBody() }, res);
    expect(HealthAdvice.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("getAllHealthAdvices returns list", async () => {
    HealthAdvice.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ _id: "1" }]),
    });
    const res = mockRes();
    await getAllHealthAdvices({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, count: 1, data: [{ _id: "1" }] })
    );
  });
});
