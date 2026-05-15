import React from 'react'
import Link from 'next/link'

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-20 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">Welcome Back</h1>
        <p className="text-slate-500 text-sm mb-10 font-medium">Access your studio dashboard and projects.</p>
        
        <form className="space-y-5">
           <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <input type="email" placeholder="name@company.com" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" />
           </div>
           <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" />
           </div>
           <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300 mt-4 shadow-xl shadow-slate-900/10">Sign In</button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Don't have an account? <Link href="/register" className="text-sky-500 font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
