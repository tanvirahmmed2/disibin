'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import axios from 'axios'
import { RiMailLine, RiLockPasswordLine, RiLoginCircleLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axios.post('/api/user/login', formData, { withCredentials: true })
            if (res.data.success) {
                window.location.replace('/profile')
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.form 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className='w-full flex-col flex gap-4' 
            onSubmit={handleSubmit}
        >
            <div className='w-full flex flex-col gap-1.5'>
                <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                        <RiMailLine size={18} />
                    </div>
                    <input 
                        type="email" 
                        id='email' 
                        name='email' 
                        required 
                        onChange={handleChange} 
                        value={formData.email} 
                        placeholder="name@example.com"
                        className='input-standard pl-12'
                    />
                </div>
            </div>

            <div className='w-full flex flex-col gap-1.5'>
                <label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                        <RiLockPasswordLine size={18} />
                    </div>
                    <input 
                        type="password" 
                        name='password' 
                        id='password' 
                        required 
                        placeholder="••••••••"
                        onChange={handleChange} 
                        value={formData.password} 
                        className='input-standard pl-12'
                    />
                </div>
            </div>

            <div className='w-full flex flex-row items-center justify-between mt-1'>
                <Link className='text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors' href={'/recover'}>Forgot password?</Link>
                <Link className='text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors' href={'/register'}>Create account</Link>
            </div>

            <button 
                type='submit' 
                disabled={isLoading}
                className='w-full mt-4 py-4 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none'
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <RiLoginCircleLine size={20} />
                        Sign In
                    </>
                )}
            </button>
        </motion.form>
    )
}

export default LoginForm
