'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AccountRecoverForm = () => {
  const [formData, setFromData] = useState({
    email: '',
    otp: '',
    new_password: '',
    confirm_password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFromData((prev) => ({ ...prev, [name]: value }))
  }
  const [passwordBox, setPasswordBox] = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    try {
      const res= await axios.put('/api/user/recover', {email:formData.email}, {withCredentials:true})
      alert(res.data.message)
      setPasswordBox(true)
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to send otp')

    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    try {
      const res= await axios.patch('/api/user/recover/password', formData, {withCredentials:true})
      alert(res.data.message)
      window.location.replace('/login')
    } catch (error) {
      alert(error?.response?.data?.message ||'Failed to change password')
      
    }
  }

  return (
    <div className='flex-1 flex flex-col items-center justify-center gap-4'>
      <form onSubmit={sendOtp} className={`w-full ${passwordBox?'hidden':'flex'} flex-col gap-2 `}>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="email">Email</label>
          <input type="email" name='email' id='email' required onChange={handleChange} value={formData.email} className='w-full px-3 p-1 border border-emerald-600/40 outline-none'/>
        </div>
        <button type='submit' className='w-full text-center text-white bg-emerald-700 rounded-xl p-1 cursor-pointer hover:bg-emerald-500'>Send OTP</button>
      </form>
      <form onSubmit={changePassword} className={`w-full ${passwordBox?'flex':'hidden'} flex-col gap-2 `}>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="otp">OTP</label>
          <input type="text" name='otp' id='otp' onChange={handleChange} value={formData.otp} className='w-full px-3 p-1 border border-emerald-600/40 outline-none'/>
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="new_password">New Password*</label>
          <input type="text" name='new_password' id='new_password' onChange={handleChange} value={formData.new_password} className='w-full px-3 p-1 border border-emerald-600/40 outline-none'/>
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="confirm_password">Re-type Password*</label>
          <input type="text" name='confirm_password' id='confirm_password' onChange={handleChange} required value={formData.confirm_password} className='w-full px-3 p-1 border border-emerald-600/40 outline-none'/>
        </div>
        {formData.new_password.length>5 && formData.new_password===formData.confirm_password &&  <button type='submit' className='w-full text-center text-white bg-emerald-700 rounded-xl p-1 cursor-pointer hover:bg-emerald-500'>Submit</button>}
       
      </form>
    </div>
  )
}

export default AccountRecoverForm
