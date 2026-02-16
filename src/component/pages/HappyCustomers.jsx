'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import ReviewCard from '../card/ReviewCard'



const HappyCustomers = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get('/api/review', { withCredentials: true })
        setReviews(response.data.payload.slice(0, 4))
      } catch (error) {
        setReviews([])
        console.log(error)

      }

    }
    fetchReview()
  }, [])
  console.log(reviews)

  return (
    <div className="w-full p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">Our Happy Customers</h1>

      {
        reviews.length > 0 ? <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          }
        </div> : <p>No data found</p>
      }

    </div>
  )
}

export default HappyCustomers
