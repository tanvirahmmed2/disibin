import { isTeamLogin } from '@/lib/auth/team'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: "Verify Account | Disibin Staff",
  description: "Verify your Disibin staff account email address."
}

const layout = async({ children }) => {
  const auth=await isTeamLogin()
    if(auth.success) return redirect('/team')
  
  return (
    <>{children}</>
  )
}

export default layout
