//CSCI2720 Group Project 26
//Au Cheuk Ming 1155125363
//Chin Wen Jun Cyril 1155104882
//Lee Yat 1155126257
//Ho Tsz Hin 1155126757
//Lee Sheung Chit 1155125027

const bcrypt = require("bcrypt");
const {
  InternalServerError,
  UnauthorizationError,
} = require("../../errorConfig");

const transporter = require("../../backendConfig").transporter;
const logger = require("../getLogger").getLogger();

const emailTemplate = (destination, username, resetPwLink) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: destination,
    subject: "Reset Password -- Weathering With Me",
    html: `Dear <i>${username}</i>,<br/>
        Please click into the link provided to reset your password.<br/>
        <a>${resetPwLink}</a>
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
  const { email, randomString, username } = resetPwInfo;
  const FRONTEND_HOST = process.env.FRONTEND_HOST;
  const resetPwLink = `${FRONTEND_HOST}/reset/${randomString}`;
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

const compareUserHash = async (userHash, hashedUserHash) => {
  try {
    const userHashCorrect = await bcrypt.compare(userHash, hashedUserHash);
    return userHashCorrect;
  } catch (error) {
    throw new UnauthorizationError("Invalid user hash!");
  }
};

exports.sendResetPwEmail = sendResetPwEmail;
exports.userHash = userHash;
exports.compareUserHash = compareUserHash;
