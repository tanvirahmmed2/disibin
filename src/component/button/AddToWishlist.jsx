'use client'
import React, { useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Context } from '../helper/Context'

const AddToWishlist = ({pack}) => {
    const {addToWishList}= useContext(Context)
  return (
    <button onClick={()=>addToWishList(pack)} className='w-full bg-black cursor-pointer text-white p-1 font-mono text-center rounded-lg flex gap-2 items-center justify-center'><FaPlus/> Wishlist</button>
            
  )
}

export default AddToWishlist
