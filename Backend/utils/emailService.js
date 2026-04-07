const nodemailer = require("nodemailer");

// Gmail transporter — uses a Google App Password (NOT your regular password)
// Steps to create App Password:
//   1. Go to https://myaccount.google.com/security
//   2. Make sure 2-Step Verification is ON
//   3. Go to https://myaccount.google.com/apppasswords
//   4. Create a new App Password for "Mail" → "Other" → name it "WalkNEarn"
//   5. Copy the 16-char password into .env as GMAIL_APP_PASSWORD (no spaces)

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,        // e.g. yourName@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

exports.sendVoucherEmail = async (toEmail, voucherCode, rewardTitle) => {
  const mailOptions = {
    from: `"Walk N Earn" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your Reward Voucher 🎉",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#16a34a;">Congratulations! 🎉</h2>
        <p>You successfully redeemed: <b>${rewardTitle}</b></p>
        <p>Your Voucher Code:</p>
        <div style="background:#f0fdf4;border:2px dashed #22c55e;border-radius:12px;padding:16px;text-align:center;margin:16px 0;">
          <h1 style="color:#15803d;letter-spacing:3px;margin:0;">${voucherCode}</h1>
        </div>
        <p style="color:#6b7280;font-size:14px;">Show this code at the store to claim your reward.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
        <p style="color:#9ca3af;font-size:12px;text-align:center;">Walk N Earn — Walk more, Earn more 🚶</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send a congratulatory email to a Top-5 leaderboard user.
 */
exports.sendTop5Email = async (toEmail, fullName, rank, weeklyPoints) => {
  const ordinal =
    rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : `${rank}th`;

  const mailOptions = {
    from: `"Walk N Earn" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `🏆 Congratulations! You're ${ordinal} on this week's leaderboard!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:28px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#16a34a;margin-bottom:4px;">🏆 Top 5 This Week!</h2>
        <p style="color:#374151;">Hi <b>${fullName}</b>,</p>
        <p style="color:#374151;">
          Great news — you've earned <b>${ordinal} place</b> on the Walk&nbsp;N&nbsp;Earn
          weekly leaderboard with <b>${weeklyPoints} points</b>!
        </p>
        <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
          <p style="font-size:48px;margin:0;">${["🥇","🥈","🥉","🏅","🏅"][rank - 1]}</p>
          <h1 style="color:#15803d;margin:8px 0 0;">${ordinal} Place</h1>
          <p style="color:#6b7280;margin:4px 0 0;">${weeklyPoints} points this week</p>
        </div>
        <p style="color:#374151;">Keep walking and stay on top! Every step counts towards a greener planet. 🌿</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
        <p style="color:#9ca3af;font-size:12px;text-align:center;">Walk N Earn — Walk more, Earn more 🚶</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};