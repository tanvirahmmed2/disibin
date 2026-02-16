import ReviewCard from '@/component/card/ReviewCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const ReviewPage = async() => {
  const res= await fetch(`${BASE_URL}/api/review`,{
    method:'GET',
    cache:'no-store'
  })

  const data= await res.json()
  if(!data.success || data.payload.length===0) return <p className='text-2xl font-semibold w-full text-center p-4'>No data found</p>
  const reviews= data.payload
  return (
    <div className='w-full flex flex-col gap-5 p-4 items-center min-h-screen'>
      <h1 className='text-2xl font-semibold w-full text-center text-emerald-600'>Best tweets from customers</h1>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {
          reviews.length>0 && reviews.map((review)=>(
            <ReviewCard key={review._id} review={review}/>
          ))
        }
      </div>
      
    </div>
  )
}

export default ReviewPage
