// src/pages/AuthPage.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // <--- NEW: Import toast for popups
import {
  useLoginMutation,
  useRegisterMutation,
} from '../features/auth/authApiSlice';

// Manually define FormInputs
type FormInputs = {
  email: string;
  password: string;
  username?: string;
};

// Validation schema for Registration
const registerSchema = yup.object().shape({
  username: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// Validation schema for Login
const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  const navigate = useNavigate();
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();
  const [registerUser, { isLoading: isRegistering, error: registerError }] = useRegisterMutation();

  const apiError = (isLoginView ? loginError : registerError) as any;
  const isLoading = isLoggingIn || isRegistering;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(isLoginView ? loginSchema : registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    reset(undefined, {
      keepValues: false,
    });
  }, [isLoginView, reset]);

  // --- UPDATED SUBMIT LOGIC ---
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (isLoading) return;

    try {
      if (isLoginView) {
        // --- LOGIN FLOW ---
        const { email, password } = data;
        console.log('Logging in...');
        await login({ email, password }).unwrap();
        navigate('/dashboard'); 
      } else {
        // --- REGISTER FLOW (Updated) ---
        const { username, email, password } = data;
        console.log('Registering...');
        
        // 1. Call Register
        await registerUser({ username, email, password_hash: password }).unwrap();

        // 2. Show Success Popup
        toast.success('Registration successful! Please verify your email.');

        // 3. Redirect to Verify Page (passing email in state so user doesn't have to type it)
        navigate('/verify', { state: { email } });
      }
    } catch (err: any) {
      console.error('Failed:', err);
      // Optional: Show error toast if you want
      // toast.error(err.data?.error || 'Operation failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 inline-block rounded-full bg-green-600 p-3 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 1-2.25 2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 1 3 12m18 0v-1.5a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 10.5v1.5m18 0m-18 0h18" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
          <p className="text-gray-500">Manage your finances with ease</p>
        </div>

        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Welcome</h2>
          <p className="text-sm text-gray-500">Sign in to your account or create a new one</p>
        </div>
        
        {/* Tab Toggles */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-200 p-1">
          <button
            onClick={() => setIsLoginView(true)} 
            type="button" 
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              isLoginView ? 'bg-white text-green-600 shadow' : 'text-gray-600'
            } transition-all duration-200 disabled:opacity-50`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginView(false)}
            type="button"
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              !isLoginView ? 'bg-white text-green-600 shadow' : 'text-gray-600'
            } transition-all duration-200 disabled:opacity-50`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-sm text-red-700">
              {apiError.data?.error || 'An unknown error occurred'}
            </div>
          )}

          {/* Full Name input */}
          {!isLoginView && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register('username')}
                disabled={isLoading}
                className={`w-full rounded-lg border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 ${
                  errors.username ? 'focus:ring-red-500' : 'focus:ring-green-500'
                } disabled:bg-gray-100`}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
            </div>
          )}

          {/* Email input */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={isLoading}
              className={`w-full rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 ${
                errors.email ? 'focus:ring-red-500' : 'focus:ring-green-500'
              } disabled:bg-gray-100`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              disabled={isLoading}
              className={`w-full rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 ${
                errors.password ? 'focus:ring-red-500' : 'focus:ring-green-500'
              } disabled:bg-gray-100`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-green-600 p-3 text-white transition-colors duration-200 hover:bg-green-700 disabled:bg-green-400"
          >
            {isLoading
              ? 'Loading...'
              : isLoginView
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;