import dotenv from "dotenv";
dotenv.config();

import type { Request, Response } from "express";
import { User } from "../modules/user/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLES } from "../constants/roles.js";
import type { AuthRequest } from "../middlewares/authMiddlewares.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || ROLES.PARTICIPANT,
    });

    res.status(201).json({ message: "User registered successfully", userId: user._id, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful", userId: user._id, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// LOGOUT
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

// GET CURRENT USER INFO
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  if(req.user)
  {
    const userInfo = await User.findById(req.user.userId).select("-password");
    res.json({ user: userInfo });
}
};
