import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Your App Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new Error("Failed to send email");
  }
};
