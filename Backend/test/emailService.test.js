const { sendVoucherEmail } = require("../utils/emailService");

describe("emailService sendVoucherEmail", () => {
  const orig = process.env.BREVO_API_KEY;

  afterEach(() => {
    process.env.BREVO_API_KEY = orig;
  });

  it("throws when BREVO_API_KEY is not configured", async () => {
    process.env.BREVO_API_KEY = "";
    await expect(
      sendVoucherEmail("user@example.com", "CODE", "Reward title")
    ).rejects.toThrow(/BREVO_API_KEY is not configured/);
  });
});
