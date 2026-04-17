import AddToWishlist from '@/component/button/AddToWishlist'
import { BASE_URL } from '@/lib/database/secret'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaPlus, FaStar } from 'react-icons/fa'

const Package = async ({ params }) => {
    const { slug } = await params
    const res = await fetch(`${BASE_URL}/api/package/${slug}`, {
        method: 'GET',
        cache: 'no-store'
    })

    const data = await res.json()
    if (!data.success) return <div className='w-full flex items-center justify-center'>
        <p>No Data Found!</p>
    </div>
    const pack = data.payload
    return (
        <div className='w-full   mx-auto flex flex-col items-center gap-4 p-4 min-h-screen'>
            <div className='w-full overflow-hidden relative'>

                <Image src={pack.image} alt='package cover' width={1000} height={1000} className='w-full  border border-black/30 shadow object-cover aspect-video rounded-xl' />
            </div>
            <h1 className='text-2xl font-semibold'>{pack.title}</h1>
            <div className='w-full flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-6'>
                <p className='w-full bg-primary cursor-pointer text-white p-1 font-mono text-center rounded-lg flex gap-2 items-center justify-center'>BDT {pack.discount > 0 ?
                    <span>
                        <strong>{pack.price - pack.discount}<span className='line-through text-red-300 px-4'>{pack.price}</span></strong>
                    </span> :
                    <strong>{pack.price}</strong>}
                </p>
                <AddToWishlist pack={pack} />
                
            </div>
            <p>{pack.category}</p>
            <p className='w-full'><strong>Description:</strong> {pack.description}</p>
            <div className='w-full flex flex-col gap-1'>
                <p className='text-xl font-bold'>Key Features:</p>
                {
                    pack.features?.map((e) => (
                        <p key={e} className='w-auto px-3 rounded-2xl flex gap-2'><FaStar className='text-orange-400' />{e}</p>
                    ))
                }
            </div>
            
            <Link className='w-full bg-primary cursor-pointer text-white p-1 font-mono text-center rounded-lg flex gap-2 items-center justify-center' href="https://api.whatsapp.com/send/?phone=8801805003886&text&type=phone_number&app_absent=0">Ask for demo</Link>
        </div>
    )
}

export default Package
