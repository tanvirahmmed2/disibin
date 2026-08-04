import LoginForm from '@/component/user/forms/LoginForm'
import Image from 'next/image'
import React from 'react'

const Login = () => {
  return (
    <div className='w-full flex items-center justify-center h-screen bg-tertiary-light'>
      <LoginForm />
    </div>
  )
}

export default Login