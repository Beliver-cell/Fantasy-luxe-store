import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config/api';
import PasswordField from './PasswordField';

const Login = ({ setToken }) => {
  // Modes: 'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password'
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const resetAllFields = () => {
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
  };

  const switchMode = (newMode) => {
    resetAllFields();
    setMode(newMode);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      if (mode === 'verify-email') {
        // Verify registration email OTP
        const response = await axios.post(`${backendUrl}/api/user/verify-email`, { userId, otp });
        if (response.data.success) {
          toast.success(response.data.message || 'Email verified successfully!');
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message || 'Verification failed');
        }

      } else if (mode === 'register') {
        // Register admin
        const response = await axios.post(`${backendUrl}/api/user/admin/register`, { name, email, password });
        if (response.data.success) {
          toast.success(response.data.message);
          if (response.data.requiresVerification) {
            setUserId(response.data.userId);
            setMode('verify-email');
          } else {
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
          }
        } else {
          toast.error(response.data.message || 'Registration failed');
        }

      } else if (mode === 'forgot-password') {
        // Request admin password reset code
        if (!email.trim()) {
          toast.error('Please enter your admin email');
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/admin/forgot-password`, { email: email.trim() });
        if (response.data.success) {
          toast.success(response.data.message || 'Reset code sent to your email');
          if (response.data.userId) {
            setUserId(response.data.userId);
          }
          setMode('reset-password');
        } else {
          toast.error(response.data.message || 'Failed to send reset code');
        }

      } else if (mode === 'reset-password') {
        // Submit OTP and new password
        const cleanOtp = otp.trim();
        if (!cleanOtp || cleanOtp.length !== 6) {
          toast.error('Please enter the 6-digit verification code');
          return;
        }

        if (newPassword.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/admin/reset-password`, {
          userId,
          email: email.trim(),
          otp: cleanOtp,
          newPassword
        });

        if (response.data.success) {
          toast.success(response.data.message || 'Password reset successfully!');
          if (response.data.token) {
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
          } else {
            switchMode('login');
          }
        } else {
          toast.error(response.data.message || 'Failed to reset password');
        }

      } else {
        // Login admin
        const response = await axios.post(`${backendUrl}/api/user/admin/login`, { email, password });
        if (response.data.success) {
          toast.success('Welcome back, Admin!');
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendRegisterOTP = async () => {
    if (resending) return;
    try {
      setResending(true);
      const response = await axios.post(`${backendUrl}/api/user/resend-otp`, { userId });
      if (response.data.success) {
        toast.success(response.data.message || 'Verification code resent');
      } else {
        toast.error(response.data.message || 'Failed to resend code');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Error resending code');
    } finally {
      setResending(false);
    }
  };

  const resendResetOTP = async () => {
    if (resending) return;
    try {
      setResending(true);
      const response = await axios.post(`${backendUrl}/api/user/admin/resend-reset-otp`, { userId, email: email.trim() });
      if (response.data.success) {
        toast.success(response.data.message || 'New reset code sent to your email');
        setOtp('');
      } else {
        toast.error(response.data.message || 'Failed to resend reset code');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Error resending code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full px-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl px-8 py-8 max-w-md w-full border border-gray-100">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {mode === 'verify-email' && 'Verify Admin Email'}
            {mode === 'register' && 'Admin Registration'}
            {mode === 'forgot-password' && 'Reset Admin Password'}
            {mode === 'reset-password' && 'Set New Password'}
            {mode === 'login' && 'Admin Portal Login'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' && 'Sign in to access your luxury store dashboard'}
            {mode === 'register' && 'Register your store administrator account'}
            {mode === 'verify-email' && 'Enter the 6-digit code sent to your email'}
            {mode === 'forgot-password' && "Enter your admin email to receive a password reset code"}
            {mode === 'reset-password' && `Enter the 6-digit code sent to ${email || 'your email'} and choose a new password`}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">

          {/* Mode: Registration extra field */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-black transition"
                type="text"
                placeholder="Admin Full Name"
                required
              />
            </div>
          )}

          {/* Mode: Email field for Login, Register, Forgot Password */}
          {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-black transition"
                type="email"
                placeholder="admin@fantasyluxe.store"
                required
              />
            </div>
          )}

          {/* Mode: Password for Login and Register */}
          {(mode === 'login' || mode === 'register') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          )}

          {/* Forgot Password link on login screen */}
          {mode === 'login' && (
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={() => switchMode('forgot-password')}
                className="text-xs font-medium text-gray-600 hover:text-black hover:underline cursor-pointer transition"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Mode: Verify Registration Email OTP */}
          {mode === 'verify-email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Verification Code</label>
              <input
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                value={otp}
                className="w-full px-3 py-2 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md outline-none focus:border-black transition"
                type="text"
                maxLength={6}
                placeholder="••••••"
                required
              />
            </div>
          )}

          {/* Mode: Reset Password OTP + New Password fields */}
          {mode === 'reset-password' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Verification Code</label>
                <input
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  value={otp}
                  className="w-full px-3 py-2 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md outline-none focus:border-black transition"
                  type="text"
                  maxLength={6}
                  placeholder="••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <PasswordField
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <PasswordField
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
            </>
          )}

          {/* Main Submit Button */}
          <button
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-md text-white bg-black hover:bg-gray-800 font-medium transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
            type="submit"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {mode === 'verify-email' && 'Verify Email'}
                {mode === 'register' && 'Register Admin'}
                {mode === 'forgot-password' && 'Send Reset Code'}
                {mode === 'reset-password' && 'Reset Password & Login'}
                {mode === 'login' && 'Sign In'}
              </>
            )}
          </button>

          {/* Resend buttons */}
          {mode === 'verify-email' && (
            <button
              type="button"
              disabled={resending}
              onClick={resendRegisterOTP}
              className="w-full py-2 px-4 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
            >
              {resending ? 'Resending Code...' : 'Resend Verification Code'}
            </button>
          )}

          {mode === 'reset-password' && (
            <button
              type="button"
              disabled={resending}
              onClick={resendResetOTP}
              className="w-full py-2 px-4 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
            >
              {resending ? 'Resending Code...' : 'Resend Reset Code'}
            </button>
          )}

        </form>

        {/* Footer Navigation Links */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm space-y-2">
          {mode === 'login' && (
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="text-gray-600 hover:text-black font-medium transition cursor-pointer"
            >
              Need to create an admin account? <span className="text-blue-600 underline">Register</span>
            </button>
          )}

          {mode === 'register' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-gray-600 hover:text-black font-medium transition cursor-pointer"
            >
              Already have an admin account? <span className="text-blue-600 underline">Login</span>
            </button>
          )}

          {(mode === 'forgot-password' || mode === 'reset-password' || mode === 'verify-email') && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black font-medium transition cursor-pointer"
            >
              ← Back to Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;
