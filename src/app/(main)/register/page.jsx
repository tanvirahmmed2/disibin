'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.password) return toast.error('Please fill all fields')

    setLoading(true)
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message, { duration: 6000 })
        router.push('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-20 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Get Started</h1>
        <p className="text-slate-500 text-sm mb-10 font-medium">Join the network and start building today.</p>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
           <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                value={formData.name}
                onChange={handleChange}
                required
              />
           </div>
           <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="name@company.com" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                value={formData.email}
                onChange={handleChange}
                required
              />
           </div>
           <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="+1 234 567 890" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                value={formData.phone}
                onChange={handleChange}
                required
              />
           </div>
           <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                value={formData.password}
                onChange={handleChange}
                required
              />
           </div>
           <button 
             disabled={loading}
             className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
           >
             {loading ? 'Creating Account...' : 'Create Account'}
           </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Already a member? <Link href="/login" className="text-sky-500 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
