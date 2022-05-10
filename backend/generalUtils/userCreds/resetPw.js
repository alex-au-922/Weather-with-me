const { InternalServerError } = require("../../errorConfig");
const bcrypt = require("bcrypt");

const transporter = require("../../backendConfig").transporter;
const logger = require("../getLogger").getLogger();

const emailTemplate = (destination, username, resetPwLink) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: destination,
    subject: "Reset Password -- Weathering With Me",
    html: `Dear <i>${username}</i>,<br/>
        Please click into the link provided to reset your password.<br/>
        ${resetPwLink}
        <br/>
        Please note that the link will be expired in 1 hour.
        <br/>
        Have a nice day!<br/>
        Weathering With Me Admin
        `,
  };
  return mailOptions;
};

const sendResetPwEmail = async (resetPwInfo) => {
  const { email, userHash, username, expiredTime } = resetPwInfo;
  const FRONTEND_HOST = process.env.FRONTEND_HOST;
  const resetPwLink = `${FRONTEND_HOST}/reset/${userHash}`;
  const template = emailTemplate(email, username, resetPwLink);
  transporter.sendMail(template, (err, info) => {
    if (err) logger.error(err.message);
  });
};

const userHash = async (userString) => {
  try {
    const salt = await bcrypt.genSalt(15);
    const userHashString = await bcrypt.hash(userString, salt);
    return userHashString;
  } catch (error) {
    throw new InternalServerError("Invalid User Hash!");
  }
};
exports.sendResetPwEmail = sendResetPwEmail;
exports.userHash = userHash;
