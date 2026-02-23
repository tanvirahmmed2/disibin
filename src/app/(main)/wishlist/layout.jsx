import { isLogin } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'


export const metadata={
    title:'Wishlist',
    description:'Wishlist page'
}


const WishListLayout = async({children}) => {
    const auth=await isLogin()
    if(!auth.success) return redirect('/login')
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default WishListLayout
