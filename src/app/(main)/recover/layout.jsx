import { isLogin } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:"Recover | Disibin",
    description:'Recover in Disibin'
}

const RecoverLayout = async({children}) => {
    const auth=await isLogin()
    if(auth.success) return redirect('/profile')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default RecoverLayout
