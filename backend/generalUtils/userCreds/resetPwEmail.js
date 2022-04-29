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
        <br/>
        Have a nice day!<br/>
        Weathering With Me
        `,
  };
  return mailOptions;
};

const sendResetPwEmail = async (resetPwInfo) => {
  const { email, userHash, username } = resetPwInfo;
  const FRONTEND_HOST = process.env.FRONTEND_HOST;
  const resetPwLink = `${FRONTEND_HOST}/reset/${userHash}`;
  const template = emailTemplate(email, username, resetPwLink);
  transporter.sendMail(template, (err, info) => {
    if (err) console.error(err);
    else console.info(info);
  });
};
exports.sendResetPwEmail = sendResetPwEmail;
