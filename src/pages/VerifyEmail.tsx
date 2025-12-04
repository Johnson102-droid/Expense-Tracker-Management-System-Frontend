import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useVerifyMutation } from '../features/auth/authApiSlice';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from the previous page state (if available)
  const initialEmail = location.state?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');

  const [verify, { isLoading }] = useVerifyMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verify({ email, code }).unwrap();
      
      toast.success('Email verified! Please log in.');
      
      // ✅ FIX: Redirect to '/auth' instead of '/login'
      // This sends the user back to the Login form.
      navigate('/auth'); 

    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.error || 'Verification failed. Check your code.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 inline-block rounded-full bg-green-100 p-3 text-green-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 text-center font-mono text-xl tracking-[0.5em] focus:border-green-500 focus:outline-none"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-green-600 py-3 font-semibold text-white transition duration-200 hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;