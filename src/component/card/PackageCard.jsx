import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PackageCard = ({ pack }) => {
    return (
        <Link href={`/packages/${pack.slug}`} className='w-full border border-teal-600 flex flex-col group items-center justify-between gap-1 p-2 shadow-xl hover:shadow-2xl transform ease-in-out duration-300 rounded overflow-hidden relative'>
            <div className='w-full aspect-video overflow-hidden'>
                <Image src={pack.image} alt='pack cover' width={1000} height={1000} className='w-full aspect-video group-hover:scale-105 ease-in-out transform duration-500 object-cover rounded-xl' />
            </div>
            <div className='w-full flex flex-col gap-1'>
                <strong>{pack.title}</strong>
                <p>{pack.description.slice(0, 70)}...</p>
                <p className='w-full text-center bg-teal-400 text-white rounded p-1'>View</p>
            </div>
        </Link>
    )
}

export default PackageCard
