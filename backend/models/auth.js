import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
        minlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    role: {
        type: String,
        enum: ["customer"], // farmer hata diya
        required: true,
        default: "customer" // optional, default to customer
    }
});

export default mongoose.model("AuthDetails", authSchema);
