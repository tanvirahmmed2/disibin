'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'
import axios from 'axios'

const WishlistPage = () => {
    const { removeFromwishlist, wishlist, clearWishlist, userData, isLoggedin } = useContext(Context)
    const [isPopUp, setIsPopUp] = useState(false)
    const [payment_method, setPayment_method] = useState('bkash')

    const subTotal = wishlist?.items?.reduce((acc, item) => acc + (Number(item.price) || 0), 0) || 0;
    const totalAmount = subTotal; 

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userData?._id) return alert("Please login first")
        const data = { 
            userId: userData._id,
            totalAmount, 
            items: wishlist.items.map(item => ({
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
                alert("Order placed successfully!")
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
        <div className="w-full p-4 relative pt-24 pb-20">
            <h1 className="text-3xl font-black mb-12 text-slate-900 tracking-tighter">
                My Wishlist <span className="text-primary ml-2">({wishlist?.items?.length || 0})</span>
            </h1>

            {wishlist?.items?.length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className='lg:col-span-2 space-y-6'>
                        {wishlist.items.map((item) => (
                            <div key={item._id} className="w-full flex items-center gap-8 p-8 bg-white border border-slate-100 rounded-[2.5rem] transition-all hover:shadow-2xl hover:shadow-slate-200/50 group">
                                <div className="w-24 h-24 relative rounded-[1.5rem] overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-50">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className='object-cover'
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200 uppercase font-black text-xs">
                                            {item.type}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border
                                            ${item.type === 'package' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                              item.type === 'membership' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                              'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <Link href={`/${item.type}s/${item.slug}`} className='text-xl font-bold text-slate-800 hover:text-primary transition-colors block leading-tight'>{item.title}</Link>
                                    <div className="mt-4 flex items-center gap-3">
                                        <span className='font-black text-slate-900'>BDT {item.price}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromwishlist(item._id)}
                                    className='p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all transform active:scale-95'
                                >
                                    <MdDeleteOutline size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 h-fit space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Order Summary</h3>
                        <div className="space-y-6 border-t border-slate-50 pt-8">
                            <div className="flex justify-between text-slate-500 font-bold text-sm">
                                <span className="uppercase tracking-widest text-[10px]">Total Items</span>
                                <span>{wishlist.items.length}</span>
                            </div>
                            <div className="flex justify-between text-3xl font-black text-slate-900 border-t border-slate-50 pt-6">
                                <span className="text-lg">Total</span>
                                <span>BDT {totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePopUp}
                            className="w-full py-6 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-slate-900 active:scale-[0.98] transition-all mt-4 uppercase tracking-widest text-[11px]"
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center gap-8">
                    <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center">
                         <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <div className="uppercase tracking-[0.3em] text-[10px] font-black text-slate-400">Empty Wishlist</div>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Your wishlist feels lonely</h3>
                    </div>
                    <Link href="/packages" className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-900/10">
                        Explore Packages
                    </Link>
                </div>
            )
        }

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