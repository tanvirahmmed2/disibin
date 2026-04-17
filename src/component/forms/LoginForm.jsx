'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import axios from 'axios'
import { RiMailLine, RiLockPasswordLine, RiLoginCircleLine } from 'react-icons/ri'

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
                alert(res.data.message)
            }
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.form 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className='w-full flex-col flex gap-5' 
            onSubmit={handleSubmit}
        >
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary/50 transition-colors">
                        <RiMailLine size={20} />
                    </div>
                    <input 
                        type="email" 
                        id='email' 
                        name='email' 
                        required 
                        onChange={handleChange} 
                        value={formData.email} 
                        className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-slate-800 placeholder:text-slate-400'
                    />
                </div>
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="password" className="text-sm font-bold text-slate-700">Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary/50 transition-colors">
                        <RiLockPasswordLine size={20} />
                    </div>
                    <input 
                        type="password" 
                        name='password' 
                        id='password' 
                        required 
                        onChange={handleChange} 
                        value={formData.password} 
                        className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-slate-800 placeholder:text-slate-400'
                    />
                </div>
            </div>

            <div className='w-full flex flex-row items-center justify-between mt-2'>
                <Link className='text-sm font-bold text-slate-500 hover:text-primary transition-colors' href={'/recover'}>Forgot password?</Link>
                <Link className='text-sm font-bold text-primary hover:text-primary-dark transition-colors' href={'/register'}>Create account</Link>
            </div>

            <button 
                type='submit' 
                disabled={isLoading}
                className='w-full mt-4 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none'
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <RiLoginCircleLine size={24} />
                        Sign In
                    </>
                )}
            </button>
        </motion.form>
    )
}

export default LoginForm
