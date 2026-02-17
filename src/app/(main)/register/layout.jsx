import { isLogin } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:"Register",
    description:'Register in Disibin'
}

const RegisterLayout = async({children}) => {
    const auth=await isLogin()
    if(auth.success) return redirect('/profile')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default RegisterLayout
