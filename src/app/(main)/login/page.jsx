import LoginForm from '@/component/forms/LoginForm'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden'>
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className='w-full max-w-[1000px] bg-white rounded-[2.5rem] shadow-premium flex flex-col md:flex-row overflow-hidden relative z-10 m-4'>
        {/* Left Side - Branding */}
        <div className='flex-1 bg-emerald-600 p-12 text-white flex flex-col justify-center relative overflow-hidden hidden md:flex'>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-black tracking-tight mb-4">Disibin</h1>
            <p className="text-emerald-50 text-xl font-medium mb-8">Your ultimate digital assistant.</p>
            <div className="space-y-4 text-emerald-100/80">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white"></span> Manage your projects seamlessly.</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white"></span> Track your tasks and support tickets.</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-white"></span> Scale your digital empire.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='flex-1 p-8 md:p-16 flex flex-col justify-center bg-white'>
          <div className="mb-8 text-center md:text-left">
            <h2 className='text-3xl font-black text-slate-900 mb-2'>Welcome Back</h2>
            <p className='text-slate-500 font-medium'>Please sign in to your account to continue.</p>
          </div>
          <LoginForm/>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
