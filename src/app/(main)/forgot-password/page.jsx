'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')

    setLoading(true)
    try {
      const res = await fetch('/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        toast.success(data.message)
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
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Reset Password</h1>
        <p className="text-slate-500 text-sm mb-10 font-medium">
          {submitted 
            ? "Check your inbox for a reset link." 
            : "Enter your email and we'll send you a link to reset your password."}
        </p>
        
        {!submitted ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>
            <button 
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center mt-6">
            <button 
              onClick={() => setSubmitted(false)}
              className="text-sky-500 font-bold hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Remember your password? <Link href="/login" className="text-sky-500 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
