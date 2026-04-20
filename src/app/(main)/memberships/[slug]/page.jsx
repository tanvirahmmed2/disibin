import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const Membership = async({params}) => {
    const {slug}=await params
    if(!slug) return <p>No slug found</p>
    const res= await fetch(`${BASE_URL}/api/membership/${slug}`,{
        method:'GET',
        cache:'no-store'
    })

    const data = await res.json()
    if (!data.success) return <div className='w-full flex items-center justify-center'>
        <p>No Data Found!</p>
    </div>
    const membership = data.payload

  return (
    <div>
      
    </div>
  )
}

export default Membership
