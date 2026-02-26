const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

exports.sendVoucherEmail = async (toEmail, voucherCode, rewardTitle) => {
  const sendSmtpEmail = {
    sender: {
      email: "methusarupasinghe@gmail.com",
      name: "walkearn-backend"
    },
    to: [
      {
        email: toEmail
      }
    ],
    subject: "Your Reward Voucher 🎉",
    htmlContent: `
      <h2>Congratulations 🎉</h2>
      <p>You redeemed: <b>${rewardTitle}</b></p>
      <p>Your Voucher Code:</p>
      <h1 style="color:green;">${voucherCode}</h1>
      <p>Show this code at the store.</p>
    `
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};