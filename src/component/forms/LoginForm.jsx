'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import axios from 'axios'

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/user/login', formData, { withCredentials: true })
            alert(res.data.message)
            window.location.replace('/profile')
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to login')

        }
    }

    return (
        <motion.form initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} className='flex-1 flex-col flex gap-3' onSubmit={handleSubmit}>
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="email">Email</label>
                <input type="email" id='email' name='email' required onChange={handleChange} value={formData.email} className='w-full px-3 p-1 border rounded-sm outline-none' />
            </div>
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="password" >Password</label>
                <input type="password" name='password' id='password' required onChange={handleChange} value={formData.password} className='w-full px-3 p-1 border rounded-sm outline-none' />
            </div>
            <div className='w-full flex flex-row items-center justify-between'>
                <Link className='text-xs' href={'/recover'}>forget password?</Link>
                <Link className='text-xs' href={'/register'}>new user?</Link>

            </div>
            <button type='submit' className='px-4 bg-teal-900 text-white p-1 cursor-pointer hover:bg-teal-700'>Login</button>
        </motion.form>
    )
}

export default LoginForm
