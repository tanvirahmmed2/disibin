'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import axios from 'axios'

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
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
            const res = await axios.post('/api/user/register', formData)
            alert(res.data.message)
            window.location.replace('/login')
        } catch (error) {
            alert(error?.response?.data?.message || "Registration failed")
        }
    }

    return (
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 1 }} 
            className='flex-1 flex-col flex gap-3'
        >
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="name">Name</label>
                <input type="text" id='name' name='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-1 border rounded-sm outline-none' />
            </div>
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="email">Email</label>
                <input type="email" id='email' name='email' required onChange={handleChange} value={formData.email} className='w-full px-3 p-1 border rounded-sm outline-none' />
            </div>
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="password">Password</label>
                <input type="password" name='password' id='password' required onChange={handleChange} value={formData.password} className='w-full px-3 p-1 border rounded-sm outline-none' />
            </div>
            <div className='w-full flex flex-row items-center justify-between'>
                <Link className='' href={'/recover'}>forget password?</Link>
                <Link className='' href={'/login'}>Already registered?</Link>

            </div>
            <button type='submit' className='px-4 bg-teal-900 text-white p-1 cursor-pointer hover:bg-teal-700 transition-colors'>
                Register
            </button>
        </motion.form>
    )
}

export default RegisterForm