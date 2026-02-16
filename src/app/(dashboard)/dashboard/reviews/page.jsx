'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/review', { withCredentials: true })
      setReviews(response.data.payload)
    } catch (error) {
      setReviews([])

    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])
  console.log(reviews)

  const handleDelete=async(id)=>{
    try {
      const response= await axios.delete('/api/review', {data: {id},withCredentials:true})
      alert(response.data.message)
      fetchReviews()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete review')
      
    }
  }

  const handleChangestatus=async(id)=>{
    try {
      const response= await axios.patch('/api/review',  {id},{withCredentials:true})
      alert(response.data.message)
      fetchReviews()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to change status')
      
    }
  }

  if (reviews.length == 0) return <p className=' font-semibold w-full text-center p-4'>No data found</p>

  return (
    <div className='w-full flex flex-col items-center p-1 sm:p-4 gap-6'>
      <h1 className='w-full text-center text-xl font-semibold'>Hear From Customers</h1>
      
      <div className='w-full flex flex-col items-center justify-center gap-2'>
        {
          reviews.map((review) => (
            <div key={review.review_id} className='w-full grid grid-cols-4 sm:grid-cols-7 gap-4 shadow rounded-2xl p-2 border border-black/30'>
              <div className='col-span-1 sm:col-span-2 flex flex-col gap-1'>
                <Image src={review.user_image} alt='user image' height={30} width={30} className='rounded-full' />
                <p>{review.user_name}</p>
                <p>{review.user_email}</p>
              </div>
              <div className='col-span-2 sm:col-span-4 flex flex-col gap-1'>
                <strong>Rating: {review.rating}</strong>
                <p>{review.comment}</p>
              </div>
              <div className='col-span-1 flex flex-col gap-1'>
                <button onClick={()=> handleDelete(review.review_id)} className='w-full bg-red-500 text-white p-1 hover:scale-95 cursor-pointer'>Delete</button>
                {
                  review.is_approved ? <button onClick={()=> handleChangestatus(review.review_id)} className='w-full bg-red-500 text-white p-1 hover:scale-95 cursor-pointer'>Make Pending</button> : <button onClick={()=> handleChangestatus(review.review_id)} className='w-full bg-green-500 text-white p-1 hover:scale-95 cursor-pointer'>Approve</button>
                }
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default ReviewsPage
