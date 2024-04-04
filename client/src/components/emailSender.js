const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: 'museai@gmail.com',
      pass: 'crkexljggotpragp'
    }
  });
  
async function sendEmail(userEmail)
{
    const html_head = '<html><body>Hello'+'!<br><br>';
    const link = "";
    const html_body = 'Please verify your email address in order to continue to MuseAI: ' + link + '<br>'
    let str = ""
    str+="<br>Sincerely, <br>"
    str+="MuseAI</body></html>"
    let mailOptions = {
      from: 'museai@gmail.com',
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

console.log("Running singular file is working!");