import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const ReviewPage = async() => {
  const res= await fetch(`${BASE_URL}/api/review`,{
    method:'GET',
    cache:'no-store'
  })

  const data= await res.json()
  if(!data.success || data.payload.length===0) return <p>No data found</p>
  const reviews= data.payload
  console.log(reviews)
  return (
    <div>
      
    </div>
  )
}

export default ReviewPage
