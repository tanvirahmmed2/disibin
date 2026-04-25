'use client'
import React, { useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Context } from '../helper/Context'

const AddToWishlist = ({pack}) => {
    const {addToWishList}= useContext(Context)
  return (
    <button 
        onClick={() => addToWishList({
            package_id: pack.package_id,
            type: 'package',
            name: pack.name,
            price: pack.price,
            slug: pack.slug,
            image: pack.image
        })} 
        className='w-full bg-slate-900 cursor-pointer text-white p-3 font-black uppercase tracking-widest text-[10px] text-center rounded-xl flex gap-2 items-center justify-center hover:bg-primary transition-all active:scale-95'
    >
        <FaPlus/> Add to Wishlist
    </button>
            
  )
}

export default AddToWishlist
