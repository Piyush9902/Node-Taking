import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendOtpEmail(to: string, otp: string) {
  const info = await transporter.sendMail({
    from: '"Notes App" <no-reply@notesapp.dev>',
    to,
    subject: 'Your OTP for Notes App',
    text: `Your OTP is ${otp}. It expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</p>`
  });
  return info;
}
