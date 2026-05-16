'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Context } from '@/component/helper/Context'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi'

const ProfilePage = () => {
  const { userData, setUserData } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    country: '',
    address_line1: '',
    state: '',
    postal_code: ''
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        city: userData.city || '',
        country: userData.country || '',
        address_line1: userData.address_line1 || '',
        state: userData.state || '',
        postal_code: userData.postal_code || ''
      })
    }
  }, [userData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Profile updated successfully!')
        setUserData({ ...userData, ...data.data })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <FiUser className="text-sky-500" /> Personal Info
          </h2>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                placeholder="John Doe"
              />
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5 opacity-60">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Email (Locked)</label>
            <div className="relative">
              <input 
                type="email" 
                value={userData?.email || ''} 
                disabled 
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 border-none cursor-not-allowed outline-none" 
              />
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
            <div className="relative">
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                placeholder="+1 234 567 890"
              />
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <FiMapPin className="text-sky-500" /> Address Details
          </h2>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Street Address</label>
            <input 
              type="text" 
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
              placeholder="123 Studio Way"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">City</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                placeholder="New York"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">State</label>
              <input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                placeholder="NY"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Country</label>
              <input 
                type="text" 
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                placeholder="USA"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Postal Code</label>
              <input 
                type="text" 
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                placeholder="10001"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button 
            disabled={loading}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
          >
            <FiSave /> {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage
