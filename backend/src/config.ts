import dotenv from "dotenv";
dotenv.config();

export const MONGO_URL = process.env.MONGO_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";
export const PORT = process.env.PORT || 3000;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL is not defined in .env file");
  process.exit(1);
}