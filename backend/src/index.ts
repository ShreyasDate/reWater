import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB, UserModel } from "./db";
import { signupSchema, signinSchema } from "./zodValidation";
import { JWT_SECRET, PORT } from "./config";
import { userMiddleware } from "./middleware";

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allows frontend to communicate

// Connect Database
connectDB();

// --- Routes ---

// 1. Sign Up
app.post("/signup", async (req, res): Promise<void> => {
  // Validate Input
  const result = signupSchema.safeParse(req.body);
  
  if (!result.success) {
    res.status(400).json({ 
      message: "Validation failed", 
      errors: result.error.format() 
    });
    return;
  }

  const { name, email, password } = result.data;

  try {
    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    await UserModel.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 2. Sign In (Modified for Specific Errors)
app.post("/signin", async (req, res): Promise<void> => {
  const result = signinSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ 
      message: "Validation failed", 
      errors: result.error.format() 
    });
    return;
  }

  const { email, password } = result.data;

  try {
    // 1. Find User
    const user = await UserModel.findOne({ email });
    if (!user) {
      // SPECIFIC ERROR: User does not exist
      res.status(404).json({ message: "User not found. Please sign up first." });
      return;
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // SPECIFIC ERROR: Password is wrong
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    // 3. Generate Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 3. Dashboard (Protected Route)
app.get("/dashboard", userMiddleware, async (req, res): Promise<void> => {
  try {
    // Fetch user details using the ID from middleware
    const user = await UserModel.findById(req.userId).select("-password"); // Exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: `Welcome to the Dashboard, ${user.name}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joined: user.createdAt
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});