'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const RecoverAccountForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams ? searchParams.get('token') : null;

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      const res = await axios.post('/api/user/recovery', { email });
      const data = res.data;

      if (data.success) {
        setSubmitted(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error('Please fill all fields');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const res = await axios.patch('/api/user/recovery', { token, newPassword });
      const data = res.data;

      if (data.success) {
        toast.success(data.message);
        router.push('/auth/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
        <div className="w-full max-w-md flex flex-col items-center justify-center gap-5 p-4 rounded-lg">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Set New Password</h1>
          <p className="text-slate-500 text-sm font-medium text-center">
            Enter your new password below to reset your account credentials.
          </p>

          <form className="w-full flex flex-col gap-3" onSubmit={handleResetPassword}>
            <div className="w-full flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="input-style"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="input-style"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full py-2 rounded-lg cursor-pointer bg-slate-900 text-white font-bold hover:bg-primary transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-5 p-4 rounded-lg">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</h1>
        <p className="text-slate-500 text-sm font-medium text-center">
          {submitted
            ? 'Check your inbox for a reset link.'
            : "Enter your email and we'll send you a link to reset your password."}
        </p>

        {!submitted ? (
          <form className="w-full flex flex-col gap-3" onSubmit={handleRequestReset}>
            <div className="w-full flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="input-style"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full py-2 rounded-lg cursor-pointer bg-slate-900 text-white font-bold hover:bg-primary transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setSubmitted(false)}
              className="text-primary font-bold hover:underline"
            >
              Didn&apos;t receive the email? Try again
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500 font-medium">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-primary font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RecoverAccountForm;
