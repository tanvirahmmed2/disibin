'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline, MdAdd, MdRemove } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'

const WishlistPage = () => {
    const { removeFromWishlist, wishlist, clearWishlist, userData, fetchUserWishlist } = useContext(Context)

    const [isPopUp, setIsPopUp] = useState(false)
    const [payment_method, setPayment_method] = useState('bkash')
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [verifyingCoupon, setVerifyingCoupon] = useState(false)
    const [localWishlist, setLocalWishlist] = useState([])

    useEffect(() => {
        // Sync local wishlist state to handle quantity adjustments locally before submit
        setLocalWishlist(wishlist.map(w => ({ ...w, quantity: w.quantity || 1 })))
    }, [wishlist])

    const handleQuantityChange = async (id, delta) => {
        setLocalWishlist(prev => prev.map(item => {
            if (item.wishlist_id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
        // Note: we can also sync to backend here if we want to persist it immediately,
        // but for a cart, local state until checkout is usually fine as long as we pass it.
    }

    const subTotal = localWishlist.reduce((acc, item) => acc + ((Number(item.price) || 0) * item.quantity), 0)
    
    let discountAmount = 0
    if (appliedCoupon) {
        if (appliedCoupon.is_percentage) {
            discountAmount = subTotal * (Number(appliedCoupon.discount) / 100)
        } else {
            discountAmount = Number(appliedCoupon.discount)
        }
    }
    const totalAmount = Math.max(0, subTotal - discountAmount)

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return toast.error("Enter a coupon code")
        setVerifyingCoupon(true)
        try {
            const res = await axios.get(`/api/coupon?code=${couponCode}`)
            if (res.data.success && res.data.data) {
                setAppliedCoupon(res.data.data)
                toast.success("Coupon applied successfully!")
            } else {
                toast.error("Invalid coupon code")
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Invalid or expired coupon')
            setAppliedCoupon(null)
        } finally {
            setVerifyingCoupon(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!userData?.user_id) {
            toast.error("Please login first")
            return
        }

        const data = {
            totalAmount,
            items: localWishlist.map(item => ({
                packageId: item.package_id,
                quantity: item.quantity,
                title: item.title,
                price: item.price
            })),
            paymentMethod: payment_method,
            couponCode: appliedCoupon?.code || null
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
                My Checkout <span className="text-emerald-500 ml-2">({localWishlist.length})</span>
            </h1>

            {localWishlist.length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    <div className='lg:col-span-2 space-y-4'>
                        {localWishlist.map((item) => (
                            <div key={item.wishlist_id} className="w-full flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                
                                <div className="w-full sm:w-24 h-24 relative rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.title} fill className='object-cover' />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[10px] uppercase font-semibold text-slate-400">
                                            Package
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className='text-lg font-bold text-slate-900 mb-1'>
                                        {item.title}
                                    </h3>
                                    <div className="font-semibold text-slate-500 text-sm mb-3">
                                        BDT {item.price} / cycle
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                                            <button onClick={() => handleQuantityChange(item.wishlist_id, -1)} className="p-2 text-slate-500 hover:text-emerald-600 transition-colors">
                                                <MdRemove size={16} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.wishlist_id, 1)} className="p-2 text-slate-500 hover:text-emerald-600 transition-colors">
                                                <MdAdd size={16} />
                                            </button>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-400">
                                            Duration: {item.quantity}x
                                        </span>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4">
                                    <div className="text-right font-bold text-slate-900">
                                        BDT {(Number(item.price) * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        onClick={() => removeFromWishlist(item.wishlist_id)}
                                        className='p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all'
                                    >
                                        <MdDeleteOutline size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-fit">
                        <h3 className="text-lg font-bold mb-6 text-slate-900">Order Summary</h3>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Discount Code</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter coupon" 
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                                <button 
                                    onClick={handleApplyCoupon}
                                    disabled={verifyingCoupon}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50"
                                >
                                    {verifyingCoupon ? '...' : 'Apply'}
                                </button>
                            </div>
                            {appliedCoupon && (
                                <p className="text-xs font-semibold text-emerald-600 mt-2">
                                    Coupon '{appliedCoupon.code}' applied!
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 text-sm font-medium text-slate-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>BDT {subTotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount</span>
                                    <span>- BDT {discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-4 border-t border-slate-50">
                                <span>Total</span>
                                <span>BDT {totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPopUp(true)}
                            className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-400">Your cart is empty</h3>
                    <Link href="/packages" className="mt-4 inline-block px-6 py-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 text-emerald-600 font-semibold text-sm transition-all shadow-sm">
                        Browse Packages
                    </Link>
                </div>
            )}

            {isPopUp && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100] p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">

                        <h2 className="text-xl font-bold mb-6 text-slate-900">Confirm Payment Details</h2>

                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 border border-slate-100">
                            <div className="flex justify-between text-sm font-semibold text-slate-500">
                                <span>Amount to Pay</span>
                                <span className="text-lg font-bold text-slate-900">BDT {totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Payment Method</label>
                                <select
                                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                    value={payment_method}
                                    onChange={(e) => setPayment_method(e.target.value)}
                                >
                                    <option value="bkash">bKash (Manual)</option>
                                    <option value="nagad">Nagad (Manual)</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Payment instructions will be provided after confirming.</p>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsPopUp(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold p-4 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-slate-900 text-white font-semibold p-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-md">
                                    Confirm Order
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