import { redirect } from 'next/navigation'
import React from 'react'

const Auth = () => {
  return redirect('/auth/login')
}

export default Auth