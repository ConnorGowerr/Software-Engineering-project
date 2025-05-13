const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const mailOptions = {
  from: '"Hellth Support" <support@hellth.com>',
  to: userEmail,
  subject: "We received your message!",
  html: `<p>Thanks for contacting us, ${userName}. We'll get back to you soon.</p>`
};

await transporter.sendMail(mailOptions);
