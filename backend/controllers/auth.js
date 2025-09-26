import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import Auth from "../models/auth.js";
import jwt from "jsonwebtoken";

// Signup schema: role fixed to customer
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("customer").required()
});

// Login schema remains the same
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});



export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Auth({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        const user = await Auth.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password." });

        const hashedNew = await bcrypt.hash(newPassword, 10);
        user.password = hashedNew;
        await user.save();

        res.status(200).json({ message: "✅ Password changed successfully!" });
    } catch (err) {
        console.error("🔥 Server error in changePassword:", err);
        res.status(500).json({ message: "Server error. Try again." });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const deletedUser = await Auth.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ message: '🗑️ Account deleted successfully.' });
    } catch (err) {
        console.error("❌ Error deleting user:", err);
        res.status(500).json({ message: 'Server error while deleting account.' });
    }
};
