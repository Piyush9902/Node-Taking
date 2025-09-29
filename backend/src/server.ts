import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";

// Load environment variables
dotenv.config();

const app = express();

// ----- Middleware -----
app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN || "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Session (required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || "session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ----- Google OAuth Strategy -----
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:4000/api/auth/google/callback", // must match Google Console
    },
    async (_accessToken, _refreshToken, profile, done) => {
      // TODO: Find or create a user in your DB based on profile.id
      // For now just pass the profile through
      return done(null, profile);
    }
  )
);

// Serialize/deserialize user for session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: Express.User, done) => done(null, obj));

// ----- Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// ----- MongoDB Connection -----
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Mongo connect error", err);
  });
