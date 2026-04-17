'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import axios from 'axios'
import { RiUserLine, RiMailLine, RiLockPasswordLine, RiUserAddLine, RiPhoneLine } from 'react-icons/ri'

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
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
            const res = await axios.post('/api/user/register', formData)
            alert(res.data.message)
            window.location.replace('/login')
        } catch (error) {
            alert(error?.response?.data?.message || "Registration failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className='w-full flex-col flex gap-5'
        >
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="name" className="text-sm font-black text-slate-900 uppercase tracking-widest text-[10px]">Account Name</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary/50 transition-colors">
                        <RiUserLine size={20} />
                    </div>
                    <input 
                        type="text" 
                        id='name' 
                        name='name' 
                        required 
                        onChange={handleChange} 
                        value={formData.name} 
                        className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-slate-800' 
                    />
                </div>
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="email" className="text-sm font-black text-slate-900 uppercase tracking-widest text-[10px]">Email Address</label>
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
                        className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-slate-800' 
                    />
                </div>
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="phone" className="text-sm font-black text-slate-900 uppercase tracking-widest text-[10px]">Contact Number</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary/50 transition-colors">
                        <RiPhoneLine size={20} />
                    </div>
                    <input 
                        type="text" 
                        id='phone' 
                        name='phone' 
                        required 
                        onChange={handleChange} 
                        value={formData.phone} 
                        className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-slate-800' 
                    />
                </div>
            </div>

            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="password" className="text-sm font-black text-slate-900 uppercase tracking-widest text-[10px]">Security Password</label>
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
                        className='w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-slate-800' 
                    />
                </div>
            </div>

            <div className='w-full flex flex-row items-center justify-between mt-2'>
                <Link className='text-sm font-bold text-slate-500 hover:text-primary transition-colors' href={'/recover'}>Forgot password?</Link>
                <Link className='text-sm font-bold text-primary hover:text-primary-dark transition-colors' href={'/login'}>Already registered?</Link>
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
                        <RiUserAddLine size={24} />
                        Register Account
                    </>
                )}
            </button>
        </motion.form>
    )
}

export default RegisterForm
