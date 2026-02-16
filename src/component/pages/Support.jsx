'use client'
import axios from 'axios'
import React, { useState } from 'react'

const Support = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/support', formData, { withCredentials: true })
      alert(response.data.message)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to send messsage")

    }
  }

  return (
    <div className='w-full  p-4 flex flex-col md:flex-row items-center justify-center gap-6'>
      <div className='w-full h-full flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold text-center'>Disibin</h1>
        <p className='text-wrap w-full text-center'>Build your dream</p>
      </div>
      <div className='w-full flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-semibold border-b-2 px-5 text-center'>Get In Touch</h1>
        <form onSubmit={handleSubmit} className='flex w-full flex-col gap-4'>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="name">Name</label>
            <input type="text" id=' name' name='name' required onChange={handleChange} value={formData.name} className='border border-teal-400/30 outline-none px-2 p-1' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email' required onChange={handleChange} value={formData.email} className='border border-teal-400/30 outline-none px-2 p-1' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="subject">Subject</label>
            <input type="text" id='subject' name='subject' required onChange={handleChange} value={formData.subject} className='border border-teal-400/30 outline-none px-2 p-1' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <label htmlFor="message">Message</label>
            <textarea name="message" id="message" required onChange={handleChange} value={formData.message} className='border border-teal-400/30 outline-none px-2 p-1' />
          </div>
          <button type='submit' className='bg-teal-600 w-auto cursor-pointer p-1 text-white hover:scale-[1.02] transform ease-in-out duration-500'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default Support
