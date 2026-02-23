'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'

const WishlistPage = () => {
    const { removeFromwishlist, wishlist } = useContext(Context)

    const subTotal = wishlist?.items?.reduce((acc, item) => acc + (Number(item.price) || 0), 0) || 0;
    const totalDiscount = wishlist?.items?.reduce((acc, item) => acc + (Number(item.discount) || 0), 0) || 0;
    const totalAmount = subTotal - totalDiscount;

    return (
        <div className="w-full p-1 sm:p-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center md:text-left">
                My Wishlist ({wishlist?.items?.length || 0})
            </h1>

            {wishlist?.items?.length > 0 ? (
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    {wishlist.items.map((product) => (
                        <div key={product.package_id} className="w-full grid grid-cols-6 border p-6 shadow-sm rounded-2xl border-black/30">
                            <div className="relative col-span-1 ">
                                <Image
                                    src={product.image || '/placeholder.jpg'}
                                    alt={product.title}
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <Link href={`/packages/${product.slug}`} className='col-span-3'>{product.title} </Link>
                            <p className='col-span-1'>
                                BDT <strong className='text-xl'>{product.price}</strong> {product.discount > 0 && <span>-{product.discount}</span>}
                            </p>
                            <MdDeleteOutline onClick={() => removeFromwishlist(product.package_id)} className='text-2xl col-span-1 cursor-pointer' />
                        </div>
                    ))}

                    <div className="w-full flex flex-col md:flex-row justify-between items-start p-6 border rounded-2xl border-black/30 shadow-xl mt-4">
                        <div className="space-y-2">
                            <p className="flex justify-between gap-10">Sub Total: <span>BDT {subTotal}</span></p>
                            <p className="flex justify-between gap-10 text-red-500">Discount: <span>- BDT {totalDiscount}</span></p>
                            <p className="flex justify-between gap-10 font-bold text-xl border-t pt-2">Total Amount: <span>BDT {totalAmount}</span></p>
                        </div>
                        
                        <Link 
                            href="/checkout" 
                            className="mt-6 md:mt-0 bg-black text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
                        >
                            Place Order
                        </Link>
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