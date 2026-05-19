'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Context } from '@/component/helper/Context';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUserData } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');

    setLoading(true);
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Login successful!');
        setUserData(data.data);
        router.push(data.data.role === 'user' ? '/user' : '/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full  max-w-4xl flex flex-col md:flex-row bg-white p-4 rounded-lg items-center justify-center gap-4">

        <div className='w-full flex flex-col gap-4 items-center justify-center'>
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mb-10 font-medium">Access your studio dashboard and projects.</p>
        </div>

        <form className="flex w-full flex-col items-center justify-center gap-3 " onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 p-2 rounded-md border border-black/20 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <Link href="/forgot-password" className="text-[10px] font-bold text-sky-500 hover:underline">Forgot Password?</Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 p-2 rounded-md border border-black/20 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-2 rounded-md cursor-pointer bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-sky-500 font-bold hover:underline">Create one</Link>
          </p>
        </form>


      </div>
    </div>
  );
};

export default LoginForm;
