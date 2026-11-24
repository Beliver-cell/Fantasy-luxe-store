import express from 'express'
import { 
    loginUser, 
    registerUser, 
    verifyEmail, 
    resendVerificationOTP, 
    forgotPassword, 
    resetPassword, 
    registerAdmin, 
    loginAdmin, 
    forgotPasswordAdmin,
    resetPasswordAdmin,
    resendAdminResetOTP,
    getUserProfile, 
    updateUserProfile 
} from '../controllers/userController.js'
import authUser from '../middleware/auth.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-email', verifyEmail)
userRouter.post('/resend-otp', resendVerificationOTP)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/admin/register', registerAdmin)
userRouter.post('/admin/login', loginAdmin)
userRouter.post('/admin/forgot-password', forgotPasswordAdmin)
userRouter.post('/admin/reset-password', resetPasswordAdmin)
userRouter.post('/admin/resend-reset-otp', resendAdminResetOTP)
userRouter.get('/profile', authUser, getUserProfile)
userRouter.put('/profile', authUser, updateUserProfile)

export default userRouter;