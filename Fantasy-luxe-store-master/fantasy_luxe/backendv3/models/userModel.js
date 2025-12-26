import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cartData: { type: Object, default: {} },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String, default: null },
    verificationOTPExpire: { type: Date, default: null },
    resetPasswordOTP: { type: String, default: null },
    resetPasswordOTPExpire: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
}, {minimize: false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
