import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import Auth from "../models/auth.js";
import jwt from "jsonwebtoken";

// Signup schema: role fixed to customer
const signupSchema = Joi.object({
    phone: Joi.string().required().min(10),
    email: Joi.string().email().optional(),
    password: Joi.string().required(),
    role: Joi.string().valid("customer").required() // farmer removed
}); 

// Login schema remains the same
const loginSchema = Joi.object({
    phone: Joi.string().required().min(10),
    password: Joi.string().required()
});

// SIGNUP
export const signup = async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { phone, email, password, role } = req.body; // role will always be "customer"
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Auth({
            phone,
            email,
            password: hashedPassword,
            role,
            authProvider: 'local'
        });
        const savedUser = await newUser.save();
        res.status(200).json({ message: "User registered successfully", user: savedUser });
    } catch (err) {
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { phone, password } = req.body;
    try {
        const user = await Auth.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, phone: user.phone, email: user.email, role: user.role, authProvider: user.authProvider }
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
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
