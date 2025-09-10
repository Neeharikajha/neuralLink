import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        minlength: 10
    },
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
        enum: ["customer"], // farmer hata diya
        required: true,
        default: "customer" // optional, default to customer
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
