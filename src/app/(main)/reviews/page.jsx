'use client'
import ReviewCard from '@/component/card/ReviewCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ReviewPage = () => {
  const [reviews, setReviews]= useState([])

  useEffect(()=>{
    const fetchReviews=async()=>{
      try {
        const response= await axios.get('/api/review/approved',{withCredentials:true})
        setReviews(response.data.payload)
      } catch (error) {
        setReviews([])
        
      }
    }
    fetchReviews()
  },[])
  if(reviews.length==0) return <p className=' font-semibold w-full text-center p-4'>No data found</p>
 
  return (
    <div className='w-full flex flex-col gap-5 p-4 items-center min-h-screen'>
      <h1 className='text-2xl font-semibold w-full text-center text-emerald-600'>Best tweets from customers</h1>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {
          reviews.length>0 && reviews.map((review)=>(
            <ReviewCard key={review.review_id} review={review}/>
          ))
        }
      </div>
      
    </div>
  )
}

export default ReviewPage
