'use client'
import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const NewsLetter = () => {

    const [formData, setFormData] = useState({
        email: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((d) => ({ ...d, [name]: value }))
    }

    const handleSubscribe = (e) => {
        e.preventDefault()
        try {

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to subscribe')

        }
    }
    return (
        <form onSubmit={handleSubscribe} className='w-full flex flex-col  items-center justify-center gap-6'>
            <p className='text-tertiary-light text-3xl'>Receive Latest Update!</p>
            <div className='w-full flex flex-col md:flex-row items-center justify-center gap-4'>
                <input type="email" name='email' id='email' onChange={handleChange} value={formData.email} placeholder='ENTER YOUR EMAIL' className='w-80 text-tertiary-dark bg-tertiary-light px-4 p-2 outline-none rounded-sm' />
                <button type='submit' className='w-auto px-6 p-2 text-tertiary-light bg-secondary'>Subscribe</button>
            </div>
        </form>
    )
}

export default NewsLetter