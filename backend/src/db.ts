import mongoose, { Schema, model } from 'mongoose';
import { MONGO_URL } from './config';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = model("User", UserSchema);