'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'
import axios from 'axios'

const WishlistPage = () => {
    const { removeFromwishlist, wishlist } = useContext(Context)

    const subTotal = wishlist?.items?.reduce((acc, item) => acc + (Number(item.price) || 0), 0) || 0;
    const totalDiscount = wishlist?.items?.reduce((acc, item) => acc + (Number(item.discount) || 0), 0) || 0;
    const totalAmount = subTotal - totalDiscount;


    const handleSubmit = async() => {
        const data= {totalAmount, items:wishlist.items}
        try {
            const res= await axios.post('/api/purchase', data, {withCredentials:true})
            alert(res.data.message)
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to place order')
        }
    }
    return (
        <div className="w-full p-1 sm:p-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center md:text-left">
                My Wishlist ({wishlist?.items?.length || 0})
            </h1>

            {wishlist?.items?.length > 0 ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className='w-full col-span-1 md:col-span-3 flex flex-col items-center gap-2'>
                        {wishlist.items.map((product) => (
                            <div key={product.package_id} className="w-full grid grid-cols-10  border p-6 even:bg-gray-100 shadow-sm rounded-2xl border-black/20">
                                <div className="relative col-span-1 p-2 ">
                                    <Image
                                        src={product.image || '/placeholder.jpg'}
                                        alt={product.title}
                                        width={500}
                                        height={500}
                                        className='w-full rounded-lg'
                                    />
                                </div>
                                <Link href={`/packages/${product.slug}`} className='col-span-5'>{product.title} </Link>
                                <p className='col-span-3 text-center'>
                                    BDT <strong className='text-xl'>{product.price - product.discount}</strong> {product.discount > 0 && <span className='text-red-500 line-through'>{product.price}</span>}
                                </p>
                                <MdDeleteOutline onClick={() => removeFromwishlist(product.package_id)} className='text-2xl text-center col-span-1 cursor-pointer' />
                            </div>
                        ))}

                    </div>
                    <div className="w-full col-span-1 md:col-span-2 p-3 rounded-xl flex flex-col justify-between items-center border border-black/30">

                        <p className="w-full flex justify-between gap-10">Sub Total: <span>BDT {subTotal}</span></p>
                        <p className="w-full flex justify-between gap-10 text-red-500">Discount: <span>- BDT {totalDiscount}</span></p>
                        <p className="w-full flex justify-between gap-10 font-bold text-xl border-t pt-2">Total Amount: <span>BDT {totalAmount}</span></p>


                        <button
                            onClick={handleSubmit}
                            disabled={!wishlist?.items?.length}
                            className="w-full bg-emerald-500 cursor-pointer text-white p-2 mt-8 text-center rounded-lg flex gap-2 items-center justify-center "
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mb-4 flex justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-600">Your wishlist is empty</h3>
                    <p className="text-gray-400 mt-2">Looks like you have not added anything yet.</p>
                    <Link href="/packages" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all font-medium">
                        Explore Packages
                    </Link>
                </div>
            )}
        </div>
    )
}

export default WishlistPage