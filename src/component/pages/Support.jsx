'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RiMailSendLine, RiMessage2Line, RiMapPinLine, RiPhoneLine } from 'react-icons/ri'

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/support', formData, { withCredentials: true })
      alert(response.data.message)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='w-full py-32 bg-white'>
      <div className='container-custom grid grid-cols-1 lg:grid-cols-2 gap-24 items-start'>
        
        <div className='space-y-12'>
            <div className='space-y-6'>
                <span className='text-emerald-600 font-black tracking-[0.4em] uppercase text-[10px]'>Contact</span>
                <h2 className='text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight'>
                    Let’s Connect<br/><span className='text-slate-400'>Your Vision.</span>
                </h2>
                <p className='text-slate-500 font-medium leading-relaxed max-w-md'>
                    Ready to scale your digital infrastructure? Drop us a line and our engineering team will get back to you within 24 hours.
                </p>
            </div>

            <div className='space-y-6 pt-4'>
                <div className='flex items-center gap-4 group'>
                    <div className='w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all'>
                        <RiMapPinLine size={24} />
                    </div>
                    <div>
                        <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Location</p>
                        <p className='text-sm font-black text-slate-900'>Dhaka, Bangladesh</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 group'>
                    <div className='w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all'>
                        <RiMailSendLine size={24} />
                    </div>
                    <div>
                        <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Email</p>
                        <p className='text-sm font-black text-slate-900'>contact@disibin.com</p>
                    </div>
                </div>
            </div>
        </div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='p-12 bg-slate-50/50 border border-slate-100 rounded-[3rem] space-y-8'
        >
            <div className='flex items-center gap-3'>
                <RiMessage2Line size={24} className='text-emerald-600' />
                <h3 className='text-xl font-black text-slate-900 tracking-tight'>Direct Inquiry</h3>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4'>Full Name</label>
                        <input name='name' required onChange={handleChange} value={formData.name} className='input-standard' />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4'>Email Address</label>
                        <input type="email" name='email' required onChange={handleChange} value={formData.email} className='input-standard' />
                    </div>
                </div>
                <div className='space-y-2'>
                    <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4'>Subject</label>
                    <input name='subject' required onChange={handleChange} value={formData.subject} className='input-standard' />
                </div>
                <div className='space-y-2'>
                    <label className='text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4'>Message</label>
                    <textarea name="message" required onChange={handleChange} value={formData.message} className='input-standard min-h-[150px] resize-none' />
                </div>
                
                <button 
                    disabled={loading}
                    type='submit' 
                    className='w-full btn-primary py-6 flex items-center justify-center gap-3'
                >
                    {loading ? 'Transmitting...' : (
                        <>Send Message <RiMailSendLine size={18} /></>
                    )}
                </button>
            </form>
        </motion.div>
      </div>
    </section>
  )
}

export default Support
