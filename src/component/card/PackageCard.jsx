import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PackageCard = ({pack}) => {
  return (
    <Link href={`/packages/${pack.slug}`} className='w-full flex flex-col items-center justify-center gap-1 p-2 shadow hover:shadow-xl transform ease-in-out duration-300 rounded-2xl overflow-hidden relative'>
            <p className='absolute top-6 right-6 bg-gray-50/50 px-4 rounded-2xl'>{pack.price? `Worth  ৳${pack.price}`:`Contact For Price`}</p>
            <div className='w-full h-70 overflow-hidden'>
                <Image src={pack.image} alt='pack cover' width={1000} height={1000} className='w-full h-70 object-cover rounded-xl'/>
            </div>
            <div className='w-full flex flex-col gap-1'>
                <strong>{pack.title}</strong>
                <p>{pack.description.slice(0, 70)}...</p>
                <p className='w-full text-center bg-orange-400 text-white rounded-2xl p-1'>View</p>
            </div>
        </Link>
  )
}

export default PackageCard
