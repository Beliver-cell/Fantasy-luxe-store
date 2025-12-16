import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP, sendVerificationOTP, sendResetPasswordOTP } from "../config/email.js";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('WARNING: JWT_SECRET not configured!');
        return 'fallback-dev-secret-change-in-production';
    }
    return secret;
}

const createToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, getJwtSecret(), { expiresIn: '7d' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success:false, message: "User doesn't exist"})
        }
        if (!user.isVerified) {
            return res.json({ success:false, message: "Please verify your email first" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success:false, message: "Invalid password" });
        }
        else{
            const token = createToken(user._id);
            res.json({ success: true, token: token });
        }
    }
    catch (err) {
        res.json({ success: false, message: err.message });
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({ success:false, message: "User already exists" });
        }
        if(!validator.isEmail(email)){
            return res.json({ success:false, message: "Please enter a valid email" });
        }
        if(password.length < 8){
            return res.json({ success:false, message: "Please enter a strong password (min 8 characters)"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationOTP = generateOTP();

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verificationOTP: verificationOTP,
            verificationOTPExpire: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
        
        const user = await newUser.save();
        
        // Send verification OTP email
        const emailSent = await sendVerificationOTP(email, verificationOTP);
        
        if (emailSent) {
            res.json({ 
                success: true,
                userId: user._id,
                message: "Account created! Check your email for verification code.",
                requiresVerification: true 
            });
        } else {
            // Delete user if email fails
            await userModel.findByIdAndDelete(user._id);
            return res.json({ success: false, message: "Failed to send verification email" });
        }

    }
    catch (error){
        res.json({success: false, message: error.message})
    }
}

// Verify Email OTP
const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        
        if (!userId || !otp) {
            return res.json({ success: false, message: "User ID and OTP required" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verificationOTP !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > user.verificationOTPExpire) {
            return res.json({ success: false, message: "OTP expired. Request a new one." });
        }

        user.isVerified = true;
        user.verificationOTP = null;
        user.verificationOTPExpire = null;
        await user.save();

        const token = createToken(user._id);
        res.json({ success: true, token, message: "Email verified! You can now login." });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Resend Verification OTP
const resendVerificationOTP = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.json({ success: false, message: "User ID required" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const newOTP = generateOTP();
        user.verificationOTP = newOTP;
        user.verificationOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const emailSent = await sendVerificationOTP(user.email, newOTP);
        
        if (emailSent) {
            res.json({ success: true, message: "New verification code sent to your email" });
        } else {
            res.json({ success: false, message: "Failed to send email" });
        }
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const resetOTP = generateOTP();
        user.resetPasswordOTP = resetOTP;
        user.resetPasswordOTPExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        const emailSent = await sendResetPasswordOTP(email, resetOTP);
        
        if (emailSent) {
            res.json({ success: true, userId: user._id, message: "Password reset code sent to your email" });
        } else {
            return res.json({ success: false, message: "Failed to send reset email" });
        }
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Reset Password with OTP
const resetPassword = async (req, res) => {
    try {
        const { userId, otp, newPassword } = req.body;
        
        if (!userId || !otp || !newPassword) {
            return res.json({ success: false, message: "All fields required" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetPasswordOTP !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (new Date() > user.resetPasswordOTPExpire) {
            return res.json({ success: false, message: "OTP expired. Request a new one." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpire = null;
        await user.save();

        res.json({ success: true, message: "Password reset successfully! You can now login." });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Admin login removed: admin UI goes straight to dashboard without a login endpoint

// Admin automatic initialization removed (admin login removed)

export { loginUser, registerUser, verifyEmail, resendVerificationOTP, forgotPassword, resetPassword };
