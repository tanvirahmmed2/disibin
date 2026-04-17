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
                setReviews(res.data.data|| [])
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
    <section className='w-full py-32 bg-slate-50/50'>
        <div className='container-custom flex flex-col items-center justify-center space-y-16'>
            <div className='text-center space-y-4'>
                <span className='text-emerald-500 font-black tracking-[0.4em] uppercase text-[10px]'>Proof of Impact</span>
                <h2 className='text-4xl md:text-6xl font-black text-slate-900 tracking-tighter'>Client Reflections.</h2>
            </div>

            <div className='w-full max-w-2xl bg-white border border-slate-100 p-12 md:p-16 rounded-[3rem] shadow-sm flex flex-col items-center text-center space-y-8 relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-2 h-full bg-emerald-500/10' />
                
                <div className='relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shadow-xl border-4 border-white'>
                    <Image src={reviews[index].user_image} alt='user image' fill className='object-cover grayscale hover:grayscale-0 transition-all duration-500'/>
                </div>
                
                <div className='space-y-6'>
                    <p className='text-xl md:text-2xl font-black text-slate-900 leading-tight italic'>"{reviews[index].comment}"</p>
                    <div>
                        <h4 className='font-black text-slate-900 uppercase tracking-widest text-[10px]'>{reviews[index].user_name}</h4>
                        <p className='text-emerald-500 font-black text-[9px] uppercase tracking-[0.2em] mt-1'>{reviews[index].user_email}</p>
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                {reviews.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 bg-slate-200 ${i === index ? 'w-8 bg-emerald-500' : 'w-2 hover:bg-slate-300'}`}
                    />
                ))}
            </div>
        </div>
    </section>
  )
}


export default Review
