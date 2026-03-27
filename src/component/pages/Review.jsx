'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Review = () => {
    const [reviews, setReviews]= useState([])
    const [index, setIndex]=useState(0)
    useEffect(()=>{
        const fetchReview=async()=>{
            try {
                const res= await axios.get('/api/review/approved',{withCredentials:true})
                setReviews(res.data.payload|| [])
            } catch (error) {
                setReviews([])
                
            }
        }
        fetchReview()
    },[])

    useEffect(()=>{
        if(!reviews || reviews.length===0) return
        const timer=setInterval(()=>{
            setIndex((prev)=> (prev+1) % reviews.length)
        },5000)
    },[reviews])


    if(!reviews || reviews.length===0) return
  return (
    <div className='w-full flex flex-col items-center justify-center gap-6 p-4 py-10'>
        <div className='w-full max-w-100 flex flex-col items-center justify-center gap-2 text-center shadow-lg p-2 rounded-2xl'>
            
            <Image src={reviews[index].user_image} alt='user image' width={400} height={400} className='w-24 aspect-square overflow-hidden object-cover rounded-full shadow shadow-black'/>
            <h1 className='text-center font-black text-3xl'>{reviews[index].user_name}</h1>
            <p className='text-xs uppercase'>{reviews[index].user_email}</p>
            <p>{reviews[index].comment}</p>
            

        </div>
        <div className='w-full flex flex-row items-center justify-center gap-2'>
            {
               reviews.length>0 && reviews.map((_,i)=>(
                <div key={i} className={`h-2 bg-emerald-700 rounded-2xl transition-all duration-500 ${i===index? 'w-2':'w-6'}`}/>
               ))
            }
        </div>
      
    </div>
  )
}

export default Review
