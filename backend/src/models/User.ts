import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  dob?: Date;
  googleId?: string;
  provider: 'otp' | 'google';
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date },
  googleId: { type: String },
  provider: { type: String, enum: ['otp', 'google'], required: true },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
