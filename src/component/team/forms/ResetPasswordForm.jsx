'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';


const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error('Please fill all fields');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await axios.post('/api/user/reset-password', { token, password });
      const data = res.data;

      if (data.success) {
        toast.success(data.message);
        router.push('/login');
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
  const labelCls = 'text-xs font-bold uppercase tracking-wider text-slate-400 ml-1';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
      <div className="w-full max-w-4xl bg-white flex flex-col md:flex-row items-center justify-center gap-4 p-4 rounded-lg">

        <div className='w-full flex flex-col items-center justify-center gap-2'>
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">New Password</h1>
          <p className="text-slate-500 text-sm mb-10 font-medium text-center">Create a strong password to protect your account.</p>
        </div>
        <form className="w-full flex flex-col items-center justify-center gap-4" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-2">
            <label className={labelCls}>New Password</label>
            <input type="password" placeholder="••••••••" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className={labelCls}>Confirm New Password</label>
            <input type="password" placeholder="••••••••" className={inputCls} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button
            disabled={loading}
            className="w-full py-2 cursor-pointer rounded-lg bg-slate-900 text-white font-bold hover:bg-primary transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Remember your password?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </form>


      </div>
    </div>
  );
};

export default ResetPasswordForm;
