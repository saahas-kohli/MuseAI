const PUBLIC_IP = "52.15.245.191";
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const pool = require("./db");

let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "museai.auth@gmail.com",
    pass: "ywga vduk kadj errp",
  },
});

async function sendVerificationEmail(userEmail) {
  const token = CryptoJS.SHA256(userEmail).toString(CryptoJS.enc.Hex);
  // const token = crypto.randomBytes(20).toString('hex'); // Generate a unique token
  // There is a very low probability (1/2^80?) that the same token is generated twice
  const verificationLink = `http://${PUBLIC_IP}:3000/verify-email?token=${token}`;

  await pool.query(
    `INSERT INTO email_verification (email, token, is_verified) VALUES($1, $2, FALSE);`,
    [userEmail, token]
  );

  const htmlContent = `<html><body>
                            Hello!<br><br>
                            Please verify your email address by clicking the link below:<br> 
                            <a href="${verificationLink}">Verify Email</a><br>
                            <br>Sincerely, <br>MuseAI
                          </body></html>`;

  let mailOptions = {
    from: "museai.auth@gmail.com",
    to: userEmail,
    subject: "Confirm your MuseAI email",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

async function sendForgotPasswordEmail(userEmail) {
  const response = await pool.query(
    `SELECT password FROM authentication WHERE email = $1;`,
    [userEmail]
  );
  const password = response.rows[0].password;

  const htmlContent = `<html><body>
                            Hello!<br><br>
                            Here's the password for your MuseAI account:<br> 
                            ${password}<br>
                            <br>Sincerely, <br>MuseAI
                          </body></html>`;

  let mailOptions = {
    from: "museai.auth@gmail.com",
    to: userEmail,
    subject: "Forgot MuseAI password",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Email sent successfully");
      // Here, you should also save the token and userEmail to your database
      // for later verification. This step is not shown.
    }
  });
}

module.exports = {
  sendVerificationEmail: sendVerificationEmail,
  sendForgotPasswordEmail: sendForgotPasswordEmail,
};
