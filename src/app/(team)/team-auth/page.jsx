import { redirect } from 'next/navigation'
import React from 'react'

const Auth = () => {
  return redirect('/team-auth/login')
}

export default Auth