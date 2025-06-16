const nodemailer = require('nodemailer');
const path = require('path');

// ✅ Send email with PDF attachment
async function sendEmail({ to, subject, text, pdfPath }) {
  // 🔐 Secure transporter using Gmail + App Password (recommended)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // App password (not account password!)
    }
  });

  // ✅ Mail options
  const mailOptions = {
    from: `"Life For Fun Travel & Tours" <${process.env.EMAIL_USER}>`,
    to, // Receiver: Customer email
    subject: subject || "Your Booking Bill - Life For Fun",
    text: text || "Please find your attached invoice. Thank you for choosing us!",
    attachments: [
      {
        filename: path.basename(pdfPath),
        path: path.resolve(pdfPath),
        contentType: 'application/pdf'
      }
    ]
  };

  // ✅ Send the email
  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
