import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP, sendVerificationOTP, sendResetPasswordOTP } from "../config/email.js";
import ENV from "../config/serverConfig.js";

const createToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, ENV.JWT_SECRET, { expiresIn: '7d' })
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

        const token = createToken(user._id, user.role);
        const message = user.role === 'admin' ? "Admin email verified! You can now login." : "Email verified! You can now login.";
        res.json({ success: true, token, message });
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

// Route for admin register
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if an admin already exists
        const existingAdmin = await userModel.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.json({ success: false, message: "Admin account already exists. Only one admin is allowed." });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationOTP = generateOTP();

        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            verificationOTP: verificationOTP,
            verificationOTPExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            isVerified: false
        });

        const admin = await newAdmin.save();

        // Send verification OTP email
        const emailSent = await sendVerificationOTP(email, verificationOTP);

        if (emailSent) {
            res.json({
                success: true,
                userId: admin._id,
                message: "Admin account created! Check your email for verification code.",
                requiresVerification: true
            });
        } else {
            // Delete admin if email fails
            await userModel.findByIdAndDelete(admin._id);
            return res.json({ success: false, message: "Failed to send verification email" });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await userModel.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.json({ success: false, message: "Admin account not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = createToken(admin._id, 'admin');
        res.json({ success: true, token: token });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const user = await userModel.findById(userId).select('-password -verificationOTP -verificationOTPExpire -resetPasswordOTP -resetPasswordOTPExpire');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const { name, phone, address } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name && typeof name === 'string' && name.trim().length > 0) {
            user.name = name.trim().substring(0, 100);
        }
        if (phone !== undefined && typeof phone === 'string') {
            user.phone = phone.trim().substring(0, 20);
        }
        if (address && typeof address === 'object') {
            user.address = {
                street: (address.street?.trim() || user.address?.street || '').substring(0, 200),
                city: (address.city?.trim() || user.address?.city || '').substring(0, 100),
                state: (address.state?.trim() || user.address?.state || '').substring(0, 100),
                zipCode: (address.zipCode?.trim() || user.address?.zipCode || '').substring(0, 20),
                country: (address.country?.trim() || user.address?.country || '').substring(0, 100)
            };
        }

        await user.save();

        const updatedUser = await userModel.findById(userId).select('-password -verificationOTP -verificationOTPExpire -resetPasswordOTP -resetPasswordOTPExpire');
        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, verifyEmail, resendVerificationOTP, forgotPassword, resetPassword, registerAdmin, loginAdmin, getUserProfile, updateUserProfile };
