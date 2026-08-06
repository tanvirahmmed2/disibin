'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password } = formData;
    if (!name || !email || !phone || !password) return toast.error('Please fill all fields');

    setLoading(true);
    try {
      const res = await axios.post('/api/user', formData);
      const data = res.data;

      if (data.success) {
        toast.success(data.message, { duration: 6000 });
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

  const inputCls = 'input-style';
  const labelCls = 'text-xs font-bold uppercase tracking-wider text-slate-400 ml-1';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-80 flex flex-col items-center justify-center gap-4 p-4">

        <div className='w-full flex flex-col items-center justify-center gap-2'>
          <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Get Started</h1>
          <p className="text-slate-500 text-sm mb-10 font-medium text-center">Join the network and start building today.</p>

        </div>
        <form className="w-full flex flex-col gap-3 items-center justify-center" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-2">
            <label className={labelCls}>Full Name</label>
            <input type="text" name="name"  className={inputCls} value={formData.name} onChange={handleChange} required />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className={labelCls}>Email Address</label>
            <input type="email" name="email"  className={inputCls} value={formData.email} onChange={handleChange} required />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className={labelCls}>Phone Number</label>
            <input type="tel" name="phone"  className={inputCls} value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className={labelCls}>Password</label>
            <input type="password" name="password" className={inputCls} value={formData.password} onChange={handleChange} required />
          </div>
          <button
            disabled={loading}
            className="w-full py-2 rounded-lg cursor-pointer bg-slate-900 text-white font-bold hover:bg-primary transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already a member?{' '}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">Login</Link>
          </p>
        </form>


      </div>
    </div>
  );
};

export default RegisterForm;
