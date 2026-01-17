import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config/api';
import PasswordField from './PasswordField';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (requiresVerification) {
        // Verify OTP
        const response = await axios.post(backendUrl + '/api/user/verify-email', { userId, otp });
        if (response.data.success) {
          toast.success(response.data.message);
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setRequiresVerification(false);
        } else {
          toast.error(response.data.message);
        }
      } else if (isRegister) {
        // Register admin
        const response = await axios.post(backendUrl + '/api/user/admin/register', { name, email, password });
        if (response.data.success) {
          toast.success(response.data.message);
          if (response.data.requiresVerification) {
            setUserId(response.data.userId);
            setRequiresVerification(true);
          } else {
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
          }
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Login admin
        const response = await axios.post(backendUrl + '/api/user/admin/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/resend-otp', { userId });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setIsRegister(false);
    setRequiresVerification(false);
    setName('');
    setEmail('');
    setPassword('');
    setOtp('');
    setUserId('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {requiresVerification ? 'Verify Admin Email' : isRegister ? 'Admin Registration' : 'Admin Login'}
        </h1>
        <form onSubmit={onSubmitHandler}>
          {requiresVerification ? (
            <>
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">Verification Code</p>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                  type="text"
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
              <button
                className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
                type="submit"
              >
                Verify Email
              </button>
              <button
                type="button"
                onClick={resendOTP}
                className="mt-2 w-full py-2 px-4 rounded-md text-black bg-gray-200 hover:bg-gray-300"
              >
                Resend Code
              </button>
            </>
          ) : (
            <>
              {isRegister && (
                <div className="mb-3 min-w-72">
                  <p className="text-sm font-medium text-gray-700 mb-2">Full Name</p>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <button
                className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
                type="submit"
              >
                {isRegister ? 'Register Admin' : 'Login'}
              </button>
            </>
          )}
        </form>
        {!requiresVerification && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                resetForm();
                setIsRegister(!isRegister);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isRegister ? 'Already have an admin account? Login' : 'Need to create admin account? Register'}
            </button>
          </div>
        )}
        {requiresVerification && (
          <div className="mt-4 text-center">
            <button
              onClick={resetForm}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
