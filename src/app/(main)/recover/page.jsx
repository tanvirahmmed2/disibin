import AccountRecoverForm from '@/component/forms/AccountRecoverForm'
import React from 'react'

const RecoverPage = () => {
  return (
    <div className='w-full flex items-center justify-center h-screen p-4 '>
      <div className='w-full sm:w-3/4 md:w-1/2 h-auto  p-4 border-0 sm:border-2 rounded-xl border-emerald-600/10 shadow flex flex-col md:flex-row items-center justify-center '>
        <div className='flex-1 flex flex-col gap-1 items-center justify-center'>
          <p>Welcome to</p>
          <h1 className='text-3xl font-semibold'>Disibin</h1>
          <p>Your best assistant</p>

        </div>
        <AccountRecoverForm/>
      </div>
    </div>
  )
}

export default RecoverPage
