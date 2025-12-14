import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';

const Login = ({setToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedAttempts = localStorage.getItem('adminLoginAttempts');
        if (storedAttempts) {
            setFailedAttempts(parseInt(storedAttempts));
        }
    }, []);

    const handleLoginFailure = () => {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem('adminLoginAttempts', newAttempts.toString());

        if (newAttempts >= 3) {
            toast.error('Too many failed attempts. Redirecting to main site...');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            const attemptsLeft = 3 - newAttempts;
            toast.error(`Invalid admin login. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`);
        }
    };

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        
        if (!backendUrl) {
            toast.error('Backend connection not configured. Please check environment variables.');
            return;
        }

        setIsLoading(true);
        try{
            const response = await axios.post(backendUrl + '/api/user/admin', {email, password}, {
                timeout: 10000
            });
            
            if(response.data.success){
                localStorage.removeItem('adminLoginAttempts');
                setFailedAttempts(0);
                setToken(response.data.token);
                toast.success('Login successful!');
            }
            else{
                handleLoginFailure();
            }
        }
        catch (error){
            if (error.response?.data?.message) {
                handleLoginFailure();
            } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                toast.error('Connection timeout. Backend server is slow. Please try again.');
            } else if (error.message === 'Network Error' || error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
                toast.error('Cannot connect to backend. Make sure backend is running.');
            } else if (!backendUrl) {
                toast.error('Backend URL not configured. Please set VITE_BACKEND_URL.');
            } else {
                handleLoginFailure();
            }
        }
        finally {
            setIsLoading(false);
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-gray-50'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Admin Panel</h1>
        <p className='text-xs text-gray-500 text-center mb-6'>Enter your admin credentials</p>
        <form onSubmit={onSubmitHandler}>
            <div className='mb-3'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:border-black transition' 
                    type="email" 
                    placeholder='admin@fantasyluxe.com' 
                    required
                    disabled={isLoading}
                />
            </div>
            <div className='mb-4'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:border-black transition' 
                    type="password" 
                    placeholder='Enter your password' 
                    required
                    disabled={isLoading}
                />
            </div>
            {failedAttempts > 0 && failedAttempts < 3 && (
                <p className='text-xs text-red-500 mb-3'>Attempts remaining: {3 - failedAttempts}</p>
            )}
            <button 
                className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed' 
                type='submit'
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
      </div>
    </div>
  )
}

export default Login
