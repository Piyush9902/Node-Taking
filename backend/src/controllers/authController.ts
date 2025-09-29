import { Request, Response } from 'express';
import OtpModel from '../models/Otp';
import User from '../models/User';
import { sendOtpEmail } from '../utils/mailer';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signJwt(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email, name, dob } = req.body;
    if (!email || !name) return res.status(400).json({ message: 'Name and email required' });

    // If email exists and provider is google, tell user to sign in via Google
    const existing = await User.findOne({ email });
    if (existing && existing.provider === 'google') {
      return res.status(400).json({ message: 'This email was registered with Google. Sign in with Google.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireMinutes = Number(process.env.OTP_EXPIRE_MINUTES || 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);

    await OtpModel.create({ email, code, expiresAt });

    // send email (in dev you can log)
    try {
      await sendOtpEmail(email, code);
    } catch (err) {
      console.warn('Mail send failed - check SMTP, logging OTP to console for dev', code);
      // fallback: don't block, but inform client that email failed (or still respond success for dev)
    }

    return res.json({ message: 'OTP sent (check email).', debugOtp: process.env.NODE_ENV !== 'production' ? code : undefined });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code, name, dob } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and OTP required' });

    const otpDoc = await OtpModel.findOne({ email, code });
    if (!otpDoc) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // create or update user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: name || 'Anonymous', email, dob: dob ? new Date(dob) : undefined, provider: 'otp' });
    } else {
      if (user.provider === 'google') {
        return res.status(400).json({ message: 'Email registered via Google. Use Google sign in.' });
      }
    }

    // remove OTPs for that email
    await OtpModel.deleteMany({ email });

    const token = signJwt({ id: user._id });
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ message: 'Google token invalid' });

    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || 'Google User';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, provider: 'google' });
    } else {
      // if user exists and provider is otp, you can allow linking or disallow; here we let google login create provider google only if googleId matches.
      if (user.provider === 'otp') {
        // optional: link googleId => here we will update user to include googleId but keep provider 'otp' (optional decision)
        user.googleId = googleId;
        await user.save();
      }
    }

    const token = signJwt({ id: user._id });
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Google auth failed' });
  }
};
