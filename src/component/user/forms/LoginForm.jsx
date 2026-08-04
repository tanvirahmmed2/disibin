'use client';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Context } from '@/component/helper/Context';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUserData } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');

    setLoading(true);
    try {
      const res = await axios.post('/api/user/login', { email, password });
      const data = res.data;

      if (data.success) {
        toast.success('Login successful!');
        // Fetch fresh user data after login
        const meRes = await axios.get('/api/user');
        if (meRes.data.success) {
          setUserData(meRes.data.data);
        }
        router.push('/user');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-slate-400 transition-colors bg-white text-slate-900';
  const labelCls = 'text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1';

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm flex flex-col p-6 rounded-2xl items-center justify-center gap-3">

        <div className='w-full flex flex-col gap-2 mb-4 items-center justify-center'>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm text-center">Access your studio dashboard and projects.</p>
        </div>

        <form className="flex w-full flex-col items-center justify-center gap-3" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-1.5">
            <label className={labelCls}>Email Address</label>
            <input
              id="user-email"
              type="email"
              className={inputCls}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className={labelCls}>Password</label>
              <Link href="/auth/recovery" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="user-password"
                type={showPassword ? 'text' : 'password'}
                className={`${inputCls} pr-12`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            id="user-login-btn"
            disabled={loading}
            className="w-full py-3 rounded-xl cursor-pointer bg-slate-900 text-white font-bold hover:bg-slate-700 transition-all duration-200 mt-2 shadow-lg shadow-slate-900/20 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="mt-2 text-center text-sm text-slate-500 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-slate-900 font-bold hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
