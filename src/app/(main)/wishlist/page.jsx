'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'
import axios from 'axios'

const WishlistPage = () => {
    const { removeFromwishlist, wishlist, clearWishlist } = useContext(Context)
    const [isPopUp, setIsPopUp] = useState(false)
    const [payment_method, setPayment_method] = useState('bkash')

    const subTotal = wishlist?.items?.reduce((acc, item) => acc + (Number(item.price) || 0), 0) || 0;
    const totalDiscount = wishlist?.items?.reduce((acc, item) => acc + (Number(item.discount) || 0), 0) || 0;
    const totalAmount = subTotal - totalDiscount;

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = { totalAmount, items: wishlist.items, payment_method }
        try {
            const res = await axios.post('/api/purchase', data, { withCredentials: true })
            if (res.data.success) {
                alert(res.data.message)
                clearWishlist()
                setIsPopUp(false)
            }
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to place order')
        }
    }

    const handlePopUp = () => {
        setIsPopUp(!isPopUp)
    }

    return (
        <div className="w-full p-4 relative">
            <h1 className="text-2xl font-black mb-8 text-slate-800">
                My Wishlist ({wishlist?.items?.length || 0})
            </h1>

            {wishlist?.items?.length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className='lg:col-span-2 space-y-4'>
                        {wishlist.items.map((product) => (
                            <div key={product.packageId} className="w-full flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                <div className="w-24 h-24 relative rounded-2xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={product.image || '/placeholder.jpg'}
                                        alt={product.title}
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                                <div className="flex-1">
                                    <Link href={`/packages/${product.slug}`} className='font-bold text-slate-800 hover:text-emerald-600 transition-colors'>{product.title}</Link>
                                    <div className="mt-2 flex items-center gap-3">
                                        <span className='font-black text-emerald-600'>BDT {product.price - product.discount}</span>
                                        {product.discount > 0 && (
                                            <span className='text-xs text-slate-400 line-through'>BDT {product.price}</span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromwishlist(product.packageId)}
                                    className='p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all'
                                >
                                    <MdDeleteOutline size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 h-fit space-y-6">
                        <h3 className="text-xl font-bold text-slate-800">Order Summary</h3>
                        <div className="space-y-4 border-t border-slate-50 pt-6">
                            <div className="flex justify-between text-slate-500 font-medium">
                                <span>Sub Total</span>
                                <span>BDT {subTotal}</span>
                            </div>
                            <div className="flex justify-between text-rose-500 font-medium">
                                <span>Total Discount</span>
                                <span>- BDT {totalDiscount}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black text-slate-900 border-t border-slate-50 pt-4">
                                <span>Total Payable</span>
                                <span>BDT {totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePopUp}
                            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-[0.98] transition-all mt-4"
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <div className="max-w-xs uppercase tracking-widest text-[10px] font-black text-slate-400">Empty Wishlist</div>
                    <h3 className="text-2xl font-bold text-slate-800">Your wishlist feels lonely</h3>
                    <Link href="/packages" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all">
                        Explore Packages
                    </Link>
                </div>
            )}

            {isPopUp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-slate-800">Complete Purchase</h2>
                                <p className="text-slate-500 font-medium">Review your order before confirming</p>
                            </div>

                            <div className="space-y-4 bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Sub Total</span>
                                    <span>BDT {subTotal}</span>
                                </div>
                                <div className="flex justify-between text-rose-500 font-medium">
                                    <span>Discount</span>
                                    <span>- BDT {totalDiscount}</span>
                                </div>
                                <div className="flex justify-between font-black text-3xl text-slate-900 border-t border-emerald-100/50 pt-4">
                                    <span>Total</span>
                                    <span>BDT {totalAmount}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Payment Method</label>
                                    <select
                                        className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                        value={payment_method}
                                        onChange={(e) => setPayment_method(e.target.value)}
                                    >
                                        <option value="bkash">bKash (Manual)</option>
                                        <option value="nagad">Nagad (Manual)</option>
                                        <option value="bank">Bank Transfer</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handlePopUp}
                                        className="flex-1 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-3 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
                                    >
                                        CONFIRM ORDER
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