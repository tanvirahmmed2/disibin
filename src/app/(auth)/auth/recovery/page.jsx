import ForgotPasswordForm from '@/component/user/forms/RecoverAccountForm'
import React, { Suspense } from 'react'

const Recovery = () => {
  return (
    <div className='w-full flex items-center justify-center bg-tertiary-light min-h-screen'>
      <Suspense fallback={<p className="text-slate-500 font-medium">Loading...</p>}>
        <ForgotPasswordForm/>
      </Suspense>
    </div>
  )
}

export default Recovery