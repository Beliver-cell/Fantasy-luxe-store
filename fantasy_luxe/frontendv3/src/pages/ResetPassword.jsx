import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/Shopcontext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);
  const [step, setStep] = useState('email'); // email, otp, password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [resending, setResending] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + '/api/user/forgot-password',
        { email }
      );

      if (response.data.success) {
        setUserId(response.data.userId);
        setStep('otp');
        toast.success('Verification code sent to your email');
      } else {
        toast.error(response.data.message || 'Failed to send code');
      }
    } catch (error) {
      toast.error('Error sending reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setStep('password');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + '/api/user/reset-password',
        { userId, otp: otp.join(''), newPassword }
      );

      if (response.data.success) {
        toast.success('✓ Password reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message || 'Reset failed');
      }
    } catch (error) {
      toast.error('Reset error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/user/forgot-password',
        { email }
      );

      if (response.data.success) {
        toast.success('New code sent to your email');
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error('Failed to resend');
      }
    } catch (error) {
      toast.error('Error resending code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-6 text-gray-800 pb-20">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Reset Password</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-700" />
      </div>

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
          <p className="text-sm text-gray-600 text-center">
            Enter your email to receive a verification code
          </p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:border-black"
            placeholder="Your Email"
            type="email"
            required
          />
          <button
            disabled={loading}
            className="bg-black text-white font-light px-8 py-2 hover:bg-gray-800 disabled:bg-gray-400"
            type="submit"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-4">
          <p className="text-sm text-gray-600 text-center">
            Enter the 6-digit code sent to your email
          </p>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && index > 0) {
                    document.getElementById(`otp-input-${index - 1}`).focus();
                  }
                }}
                className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            ))}
          </div>
          <button
            className="bg-black text-white font-light px-8 py-2 hover:bg-gray-800"
            type="submit"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resending}
            className="text-sm text-gray-600 hover:text-black underline disabled:text-gray-400"
          >
            {resending ? 'Sending...' : "Didn't receive code? Resend"}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-4">
          <p className="text-sm text-gray-600 text-center">
            Enter your new password
          </p>
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:border-black"
            placeholder="New Password (min 8 chars)"
            type="password"
            required
          />
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:border-black"
            placeholder="Confirm Password"
            type="password"
            required
          />
          <button
            disabled={loading}
            className="bg-black text-white font-light px-8 py-2 hover:bg-gray-800 disabled:bg-gray-400"
            type="submit"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <p className="text-sm text-gray-600 text-center">
        Remember your password? <a href="/login" className="text-black underline">Login here</a>
      </p>
    </div>
  );
};

export default ResetPassword;
