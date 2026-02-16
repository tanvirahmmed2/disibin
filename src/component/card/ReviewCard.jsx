'use client'
import Image from 'next/image'
import React from 'react'

const ReviewCard = ({ review }) => {
    return (
        <div className='w-full flex flex-col items-center gap-2 p-2 rounded-2xl shadow hover:shadow-2xl transform ease-in-out duration-500 shadow-emerald-200 text-center cursor-pointer'>
            <Image src={review.userImage} alt='user image' width={100} height={100} className='aspect-square object-cover rounded-full' />
            <h1 className='font-mono text-2xl font-semibold'>{review.userName}</h1>
            <p>{review.comment}</p>
        </div>
    )
}

export default ReviewCard
