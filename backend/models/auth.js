import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: false,
        minlength: 5
    },
    role: {
        type: String,
        enum: ["customer"],
        required: true,
        default: "customer"
    },
    authProvider: {
        type: String,
        enum: ["local", "github"],
        default: "local"
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("AuthDetails", authSchema);
