import express from 'express'
import { loginUser, registerUser, verifyEmail, resendVerificationOTP, forgotPassword, resetPassword } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-email', verifyEmail)
userRouter.post('/resend-otp', resendVerificationOTP)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
// Admin login removed: admin panel goes straight to dashboard without authentication

export default userRouter;