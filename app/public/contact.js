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
  html:`
  <div style="background-color:#1C1F21; color:#EFEDE7; font-family:'Poppins',sans-serif; padding:2rem; border-radius:12px; max-width:600px; margin:auto;">
    <h2 style="font-family:'Oswald',sans-serif; color:#FF7043;">Hi ${username},</h2>
    <p style="margin-top:1rem;">Thanks for contacting <strong>Hellth Support</strong>.</p>
    
    <div style="margin: 1.5rem 0; background-color:#2A2A2A; padding:1rem; border-radius:8px;">
      <p style="margin:0;"><strong style="color:#FFA260;">Reason:</strong> ${reason}</p>
      <p style="margin-top:0.75rem;"><strong style="color:#FFA260;">Your Message:</strong></p>
      <p style="white-space:pre-wrap; margin:0;">${feedbackInput}</p>
    </div>

    <p style="margin-top:2rem;">We’ll be in touch shortly.</p>
    <hr style="border: none; border-top: 1px solid #555; margin: 2rem 0;">
    <p style="font-size:0.9rem; color:#888;">This is an automated message from Hellth. Please do not reply.</p>
  </div>`
};

await transporter.sendMail(mailOptions);
