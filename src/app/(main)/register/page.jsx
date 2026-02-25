import RegisterForm from '@/component/forms/RegisterForm'
import React from 'react'

const RegisterPage = () => {
  return (
    <div className='w-full flex items-center justify-center h-screen p-4'>
      <div className='w-full sm:w-3/4 md:w-1/2 h-auto p-4 border-0 sm:border-2 rounded-xl border-black/10 shadow flex flex-col-reverse md:flex-row items-center justify-center '>
        <RegisterForm />
        <div className='flex-1 flex flex-col gap-1 items-center justify-center'>
          <p>Welcome to</p>
          <h1 className='text-3xl font-semibold'>Disibin</h1>
          <p>Your best assistant</p>

        </div>

      </div>
    </div>
  )
}

export default RegisterPage
