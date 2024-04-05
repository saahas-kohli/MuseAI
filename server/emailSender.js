/*

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'museai.auth@gmail.com',
      pass: 'ywga vduk kadj errp'
    }
  });
  
function sendEmail(userEmail)
{
    const html_head = '<html><body>Hello'+'!<br><br>';
    const link = "";
    const html_body = 'Please verify your email address in order to continue to MuseAI: ' + link + '<br>'
    let str = ""
    str+="<br>Sincerely, <br>"
    str+="MuseAI</body></html>"
    let mailOptions = {
      from: 'museai.auth@gmail.com',
      to: userEmail,
      subject: 'Confirm your MuseAI email.',
      html: html_head+html_body+str
    };
      
    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });    
}

sendEmail('danielrobertfields@gmail.com');
console.log("Running singular file is working!");

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

// import CryptoJS from 'crypto-js';
const CryptoJS = require('crypto-js');

const nodemailer = require('nodemailer');
// const crypto = require('crypto');
const pool = require("./db");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'museai.auth@gmail.com',
      pass: 'ywga vduk kadj errp'
    }
});

async function sendEmail(userEmail) {
    const token = CryptoJS.SHA256(userEmail).toString(CryptoJS.enc.Hex);
    // const token = crypto.randomBytes(20).toString('hex'); // Generate a unique token
    // There is a very low probability (1/2^80?) that the same token is generated twice
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

    await pool.query(
      `INSERT INTO email_verification (email, token, is_verified) VALUES($1, $2, FALSE);`,
      [userEmail, token]
    );

    const htmlContent = `<html><body>
                            Hello!<br><br>
                            Please verify your email address by clicking the link below: 
                            <a href="${verificationLink}">Verify Email</a><br>
                            <br>Sincerely, <br>MuseAI
                          </body></html>`;

    let mailOptions = {
        from: 'museai.auth@gmail.com',
        to: userEmail,
        subject: 'Confirm your MuseAI email.',
        html: htmlContent
    };
    
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Email sent successfully");
            // Here, you should also save the token and userEmail to your database
            // for later verification. This step is not shown.
        }
    });    
}

//sendEmail('danielrobertfields@gmail.com');
//console.log("Script ran successfully");
module.exports = sendEmail;


