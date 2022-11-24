const transporter = require("../../config/nodemailer.config");

exports.sendMail = async (mailOptions) => {
  try {
    const { from, to, subject, html } = mailOptions;

    await transporter.sendMail({
      from: "bilal428899@gmail.com",
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("sendMail...", error);
  }
};
