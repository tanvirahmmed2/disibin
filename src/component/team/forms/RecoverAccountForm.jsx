'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const RecoverAccountForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams ? searchParams.get('token') : null;

  const [email, setEmail]             = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  // Step 1 — Request reset email
  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      const res = await axios.post('/api/team/recovery', { email });
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

  // Step 2 — Reset password with token
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error('Please fill all fields');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await axios.patch('/api/team/recovery', { token, newPassword });
      const data = res.data;

      if (data.success) {
        toast.success(data.message);
        router.push('/team-auth/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'input-style';
  const labelCls = 'text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1';

  // Step 2 — Password reset form (token present in URL)
  if (token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
        <div className="w-full max-w-sm flex flex-col items-center justify-center gap-3 p-6 rounded-2xl">
          <div className="w-full flex flex-col gap-2 mb-4 items-center justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Set New Password</h1>
            <p className="text-slate-500 text-sm text-center">
              Enter your new password below to reset your staff account credentials.
            </p>
          </div>

          <form className="w-full flex flex-col gap-3" onSubmit={handleResetPassword}>
            <div className="w-full flex flex-col gap-1.5">
              <label className={labelCls}>New Password</label>
              <input
                id="team-new-password"
                type="password"
                placeholder="Enter new password (min 6 chars)"
                className={inputCls}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="w-full flex flex-col gap-1.5">
              <label className={labelCls}>Confirm New Password</label>
              <input
                id="team-confirm-password"
                type="password"
                placeholder="Confirm new password"
                className={inputCls}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              id="team-reset-btn"
              disabled={loading}
              className="w-full py-3 rounded-xl cursor-pointer bg-slate-900 text-white font-bold hover:bg-slate-700 transition-all duration-200 mt-2 shadow-lg shadow-slate-900/20 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-2 text-center text-sm text-slate-500 font-medium">
            Remember your password?{' '}
            <Link href="/team-auth/login" className="text-slate-900 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 1 — Email request form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
      <div className="w-full max-w-sm flex flex-col items-center justify-center gap-3 p-6 rounded-2xl">
        <div className="w-full flex flex-col gap-2 mb-4 items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</h1>
          <p className="text-slate-500 text-sm text-center">
            {submitted
              ? 'Check your inbox for a password reset link.'
              : "Enter your staff email and we'll send you a reset link."}
          </p>
        </div>

        {!submitted ? (
          <form className="w-full flex flex-col gap-3" onSubmit={handleRequestReset}>
            <div className="w-full flex flex-col gap-1.5">
              <label className={labelCls}>Email Address</label>
              <input
                id="team-recovery-email"
                type="email"
                placeholder="name@disibin.com"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              id="team-send-reset-btn"
              disabled={loading}
              className="w-full py-3 rounded-xl cursor-pointer bg-slate-900 text-white font-bold hover:bg-slate-700 transition-all duration-200 mt-2 shadow-lg shadow-slate-900/20 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center w-full">
            <button
              onClick={() => setSubmitted(false)}
              className="text-slate-600 font-semibold hover:underline text-sm"
            >
              Didn&apos;t receive the email? Try again
            </button>
          </div>
        )}

        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Remember your password?{' '}
          <Link href="/team-auth/login" className="text-slate-900 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RecoverAccountForm;
