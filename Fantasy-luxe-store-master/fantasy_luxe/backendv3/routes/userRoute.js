import express from 'express'
import { loginUser, registerUser, verifyEmail, resendVerificationOTP, forgotPassword, resetPassword, registerAdmin, loginAdmin } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-email', verifyEmail)
userRouter.post('/resend-otp', resendVerificationOTP)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/admin/register', registerAdmin)
userRouter.post('/admin/login', loginAdmin)

export default userRouter;