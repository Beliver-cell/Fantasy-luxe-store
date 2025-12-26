import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/Shopcontext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const userId = localStorage.getItem('pendingVerificationId');

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600">No pending verification</p>
        <p className="text-sm text-gray-400 mt-2">
          <a href="/login" className="text-black underline">Return to login</a>
        </p>
      </div>
    );
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/user/verify-email',
        { userId, otp: otpString }
      );

      if (response.data.success) {
        toast.success('✓ Email verified successfully!');
        localStorage.removeItem('pendingVerificationId');
        localStorage.setItem('token', response.data.token);
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      toast.error('Verification error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const response = await axios.post(
        backendUrl + '/api/user/resend-otp',
        { userId }
      );

      if (response.data.success) {
        toast.success('New code sent to your email');
        setOtp(['', '', '', '', '', '']);
      } else {
        toast.error(response.data.message || 'Failed to resend');
      }
    } catch (error) {
      toast.error('Error resending OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-6 text-gray-800 pb-20">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Verify Email</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-700" />
      </div>

      <p className="text-sm text-gray-600 text-center">
        We've sent a 6-digit verification code to your email. Enter it below.
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
        disabled={loading}
        className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 disabled:bg-gray-400 w-full"
        type="submit"
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>

      <button
        type="button"
        onClick={handleResendOTP}
        disabled={resending}
        className="text-sm text-gray-600 hover:text-black underline disabled:text-gray-400"
      >
        {resending ? 'Sending...' : "Didn't receive code? Resend"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Code expires in 10 minutes
      </p>
    </form>
  );
};

export default VerifyEmail;
