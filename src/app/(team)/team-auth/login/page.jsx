import LoginForm from '@/component/team/forms/LoginForm'
import Image from 'next/image'
import React from 'react'

const Login = () => {
  return (
    <div className='w-full flex flex-row items-center justify-center h-screen overflow-hidden'>
      <div className='w-full hidden lg:flex flex-col items-center justify-end h-screen overflow-hidden'>
        <p className='text-center text-tertiary-dark max-w-md'>Securely access your employee dashboard to manage your daily responsibilities, schedules, attendance, tasks, and institutional resources. Everything you need to stay productive and connected is available in one secure platform.</p>
        <Image src={'/client.png'} alt='team member' width={1000} height={1000} className='w-full max-w-72'/>

      </div>
      <div className='w-full flex items-center justify-center bg-tertiary-light'>
        <LoginForm/>

      </div>

    </div>
  )
}

export default Login