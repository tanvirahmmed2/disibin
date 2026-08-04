import RecoverAccountForm from '@/component/team/forms/RecoverAccountForm'
import React, { Suspense } from 'react'

const Recovery = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      }>
        <RecoverAccountForm />
      </Suspense>
    </div>
  )
}

export default Recovery