import { isTeamLogin } from '@/lib/auth/team'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:"Login | Disibin",
    description:"Login and access your account. Disibin"
}

const  layout = async({children}) => {
  const auth=await isTeamLogin()
  if(auth.success) return redirect('/team')

  return (
    <>{children}</>
  )
}

export default layout