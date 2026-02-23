'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const WishlistPage = () => {
    // Note: Ensuring we grab removeFromwishlist and wishlist from context
    const { removeFromwishlist, wishlist } = useContext(Context)

    return (
        <div className="w-full p-1 sm:p-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center md:text-left">
                My Wishlist ({wishlist?.items?.length || 0})
            </h1>

            {wishlist?.items?.length > 0 ? (
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    {wishlist.items.map((product) => (
                        <div key={product.package_id} className="w-full flex flex-col md:flex-row items-center justify-between relative border p-2 shadow-2xl rounded-2xl">
                            
                            <button 
                                onClick={() => removeFromwishlist(product.package_id)}
                                className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full shadow-sm transition-all border border-red-100"
                                title="Remove from Wishlist"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="relative h-48  ">
                                <Image 
                                    src={product.image || '/placeholder.jpg'} 
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    className="object-contain"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow">
                                <h2 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] text-gray-800">
                                    {product.title}
                                </h2>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-blue-600">${product.price}</span>
                                    {product.discount > 0 && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ${(product.price + product.discount).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                <Link 
                                    href={`/product/${product.slug}`} // Changed to slug to match your addToWishList object
                                    className="text-center bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mb-4 flex justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-600">Your wishlist is empty</h3>
                    <p className="text-gray-400 mt-2">Looks like you haven't added anything yet.</p>
                    <Link href="/shop" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all font-medium">
                        Explore Products
                    </Link>
                </div>
            )}
        </div>
    )
}

export default WishlistPage