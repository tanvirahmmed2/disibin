'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'
import axios from 'axios'

const WishlistPage = () => {
    const { removeFromwishlist, wishlist } = useContext(Context)
    const [isPopUp, setIsPopUp] = useState(false)
    const [payment_method, setPayment_method] = useState('bkash')

    const subTotal = wishlist?.items?.reduce((acc, item) => acc + (Number(item.price) || 0), 0) || 0;
    const totalDiscount = wishlist?.items?.reduce((acc, item) => acc + (Number(item.discount) || 0), 0) || 0;
    const totalAmount = subTotal - totalDiscount;


    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = { totalAmount, items: wishlist.items }
        try {
            const res = await axios.post('/api/purchase', data, { withCredentials: true })
            alert(res.data.message)
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to place order')
        }
    }

    const handlePopUp = () => {
        setIsPopUp(!isPopUp)
    }

    return (
        <div className="w-full p-1 sm:p-4 relative">
            <h1 className="text-xl font-bold mb-8 text-gray-800 text-center md:text-left">
                My Wishlist ({wishlist?.items?.length || 0})
            </h1>

            {wishlist?.items?.length > 0 ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className='w-full col-span-1 md:col-span-3 flex flex-col mb-10 p-1 items-center gap-2'>
                        {wishlist.items.map((product) => (
                            <div key={product.package_id} className="w-full grid text-xs sm:text-base grid-cols-10 p-6 even:bg-gray-100 shadow-sm rounded-2xl ">
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
                                    BDT <strong className=''>{product.price - product.discount}</strong> {product.discount > 0 && <span className='text-red-500 line-through'>{product.price}</span>}
                                </p>
                                <MdDeleteOutline onClick={() => removeFromwishlist(product.package_id)} className='text-base sm:text-xl md:text-2xl text-red-500 text-center col-span-1 cursor-pointer' />
                            </div>
                        ))}

                    </div>
                    <div className="w-full text-xs gap-2 col-span-1 md:col-span-2 p-3 rounded-xl  flex flex-col justify-between items-center">

                        <p className="w-full flex justify-between gap-10">Sub Total: <span>BDT {subTotal}</span></p>
                        <p className="w-full flex justify-between gap-10 text-red-500">Discount: <span>- BDT {totalDiscount}</span></p>
                        <p className="w-full flex justify-between gap-10 font-bold border-t pt-2">Total Amount: <span>BDT {totalAmount}</span></p>


                        <button
                            onClick={handlePopUp}
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

            {isPopUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">

                        <div className="bg-gray-50 border-b p-6">
                            <h2 className="text-xl font-bold text-gray-800 text-center">Checkout Summary</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>Sub Total</span>
                                    <span>BDT {subTotal}</span>
                                </div>
                                <div className="flex justify-between text-red-500">
                                    <span>Discount</span>
                                    <span>- BDT {totalDiscount}</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-gray-900 border-t pt-2">
                                    <span>Total Amount</span>
                                    <span>BDT {totalAmount}</span>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 bg-amber-50 border-l-4 border-amber-400 p-3 italic">
                                <p>After placing the order, our representative will call you to confirm. Please complete payment before confirmation.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="payment_method" className="text-sm font-semibold text-gray-700">
                                        Select Payment Method
                                    </label>
                                    <select
                                        className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                                        name="payment_method"
                                        id="payment_method"
                                        value={payment_method}
                                        onChange={(e) => setPayment_method(e.target.value)}
                                    >
                                        <option value="bkash">bKash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="bank">Bank Transfer</option>
                                    </select>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handlePopUp}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors uppercase text-sm tracking-wider"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all uppercase text-sm tracking-wider"
                                    >
                                        Confirm Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WishlistPage