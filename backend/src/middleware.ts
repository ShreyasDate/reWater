import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.status(403).json({ message: "No token provided" });
    return; 
  }

  // Handle "Bearer <token>" format if present, or just <token>
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (decoded && decoded.id) {
      req.userId = decoded.id;
      next();
    } else {
      res.status(403).json({ message: "Invalid token payload" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};