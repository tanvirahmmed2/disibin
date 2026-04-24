'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'

const WishlistPage = () => {
    const { removeFromWishlist, wishlist, clearWishlist, userData } = useContext(Context)

    const [isPopUp, setIsPopUp] = useState(false)
    const [payment_method, setPayment_method] = useState('bkash')

    const subTotal = wishlist.reduce((acc, item) => acc + (Number(item.price) || 0), 0)
    const totalAmount = subTotal

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!userData?.user_id) {
            toast.error("Please login first")
            return
        }

        const data = {
            totalAmount,
            items: wishlist.map(item => ({
                itemId: item.itemId,
                type: item.type,
                title: item.title,
                price: item.price
            })),
            paymentMethod: payment_method
        }

        try {
            const res = await axios.post('/api/purchase', data, { withCredentials: true })

            if (res.data.success) {
                toast.success("Order placed successfully!")
                clearWishlist()
                setIsPopUp(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to place order')
        }
    }

    return (
        <div className="w-full p-4 relative pt-24 pb-20">
            <h1 className="text-3xl font-bold mb-10 text-slate-900 tracking-tighter">
                My Wishlist <span className="text-emerald-500 ml-2">({wishlist.length})</span>
            </h1>

            {wishlist.length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    <div className='lg:col-span-2 space-y-4'>
                        {wishlist.map((item) => (
                            <div key={item.wishlist_id} className="w-full flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
                                
                                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-50">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.title} fill className='object-cover' />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[10px] uppercase font-semibold text-slate-400">
                                            {item.type}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <Link href={`/${item.type}s/${item.slug}`} className='text-base font-semibold text-slate-800 hover:text-emerald-600 transition-colors'>
                                        {item.title}
                                    </Link>

                                    <div className="mt-1 font-semibold text-slate-500 text-sm">
                                        BDT {item.price}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => removeFromWishlist(item.wishlist_id)}
                                    className='p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all'
                                >
                                    <MdDeleteOutline size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-fit">
                        <h3 className="text-lg font-bold mb-6 text-slate-900">Order Summary</h3>

                        <div className="space-y-4 text-sm font-medium text-slate-600">
                            <div className="flex justify-between">
                                <span>Total Items</span>
                                <span>{wishlist.length}</span>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-4 border-t border-slate-50">
                                <span>Total</span>
                                <span>BDT {totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPopUp(true)}
                            className="w-full mt-6 py-4 bg-slate-900 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-400">Wishlist is empty</h3>
                    <Link href="/packages" className="mt-4 inline-block text-emerald-600 font-semibold text-sm">
                        Browse Packages
                    </Link>
                </div>
            )}

            {isPopUp && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100]">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">

                        <h2 className="text-xl font-bold mb-6 text-slate-900">Complete Purchase</h2>

                        <div className="mb-6 space-y-2">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>BDT {subTotal}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-slate-900">
                                <span>Total Amount</span>
                                <span>BDT {totalAmount}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select
                                className="w-full p-3 border rounded-xl"
                                value={payment_method}
                                onChange={(e) => setPayment_method(e.target.value)}
                            >
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="bank">Bank</option>
                            </select>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsPopUp(false)} className="flex-1 bg-gray-200 p-3 rounded-xl">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-emerald-500 text-white p-3 rounded-xl">
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WishlistPage