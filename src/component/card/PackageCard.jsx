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
                <div className='w-full flex flex-wrap gap-1'>
                    {
                        pack.features.map((e) => (
                            <p key={e} className='w-auto px-3 bg-emerald-50 rounded-2xl'>{e}</p>
                        ))
                    }
                </div>
            </div>
        </Link>
  )
}

export default PackageCard
