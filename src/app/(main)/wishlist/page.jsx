'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline, MdAdd, MdRemove } from 'react-icons/md'
import { RiShoppingCart2Line, RiCoupon3Line, RiCheckLine, RiCloseLine, RiArrowRightLine, RiShieldCheckLine } from 'react-icons/ri'
import axios from 'axios'
import toast from 'react-hot-toast'

const WishlistPage = () => {
    const { removeFromWishlist, wishlist, clearWishlist, userData } = useContext(Context)

    const [showCheckout, setShowCheckout] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('bkash')
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [verifyingCoupon, setVerifyingCoupon] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [localWishlist, setLocalWishlist] = useState([])

    useEffect(() => {
        setLocalWishlist(wishlist.map(w => ({ ...w, quantity: w.quantity || 1 })))
    }, [wishlist])

    // Reset coupon when cart changes
    useEffect(() => {
        setAppliedCoupon(null)
        setCouponCode('')
    }, [localWishlist.length])

    const handleQuantityChange = (id, delta) => {
        setLocalWishlist(prev => prev.map(item => {
            if (item.wishlist_id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
        // Reset coupon on qty change as discount needs recalculation
        setAppliedCoupon(null)
    }

    const subTotal = localWishlist.reduce((acc, item) => acc + ((Number(item.price) || 0) * (item.quantity || 1)), 0)

    let discountAmount = 0
    if (appliedCoupon) {
        if (appliedCoupon.package_id) {
            // Apply only to the matching package(s)
            const matchingItems = localWishlist.filter(item => item.package_id === appliedCoupon.package_id)
            const packageSubtotal = matchingItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0)
            
            discountAmount = appliedCoupon.is_percentage
                ? packageSubtotal * (Number(appliedCoupon.discount) / 100)
                : Number(appliedCoupon.discount)
            discountAmount = Math.min(discountAmount, packageSubtotal)
        } else {
            // Generic coupon: Apply to subtotal
            if (appliedCoupon.is_percentage) {
                discountAmount = subTotal * (Number(appliedCoupon.discount) / 100)
            } else {
                discountAmount = Number(appliedCoupon.discount)
            }
            discountAmount = Math.min(discountAmount, subTotal)
        }
    }
    const totalAmount = Math.max(0, subTotal - discountAmount)

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return toast.error("Please enter a coupon code")
        setVerifyingCoupon(true)
        try {
            const res = await axios.get(`/api/coupon?code=${encodeURIComponent(couponCode.trim())}`)
            if (res.data.success && res.data.data) {
                const coupon = res.data.data
                // Check if coupon is for a specific package
                if (coupon.package_id) {
                    const hasMatchingPackage = localWishlist.some(item => item.package_id === coupon.package_id)
                    if (!hasMatchingPackage) {
                        toast.error(`This coupon is only valid for the "${coupon.name}" package`)
                        return
                    }
                }
                setAppliedCoupon(coupon)
                const discAmt = coupon.is_percentage
                    ? subTotal * (Number(coupon.discount) / 100)
                    : Number(coupon.discount)
                toast.success(`Coupon applied! You save ৳${Math.min(discAmt, subTotal).toFixed(2)}`)
            } else {
                toast.error("Invalid or expired coupon code")
                setAppliedCoupon(null)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Invalid or expired coupon')
            setAppliedCoupon(null)
        } finally {
            setVerifyingCoupon(false)
        }
    }

    const removeCoupon = () => {
        setAppliedCoupon(null)
        setCouponCode('')
        toast.success('Coupon removed')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userData?.user_id) return toast.error("Please login first")
        if (localWishlist.length === 0) return toast.error("Your cart is empty")

        setSubmitting(true)
        try {
            const res = await axios.post('/api/purchase', {
                items: localWishlist.map(item => ({
                    packageId: item.package_id,
                    quantity: item.quantity || 1,
                })),
                paymentMethod,
                couponCode: appliedCoupon?.code || null
            }, { withCredentials: true })

            if (res.data.success) {
                toast.success("Order placed successfully! We'll contact you with payment instructions.")
                await clearWishlist()
                setShowCheckout(false)
                setAppliedCoupon(null)
                setCouponCode('')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to place order. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (localWishlist.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                    <RiShoppingCart2Line size={36} className="text-slate-300" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
                <p className="text-slate-500 mb-8 font-medium">Add packages to your cart and come back here to checkout.</p>
                <Link 
                    href="/packages" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all text-sm shadow-md"
                >
                    Browse Packages <RiArrowRightLine />
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full px-4 pt-24 pb-20 max-w-6xl mx-auto">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        My Cart
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">{localWishlist.length} item{localWishlist.length !== 1 ? 's' : ''} in your cart</p>
                </div>
                <button
                    onClick={() => {
                        if (window.confirm('Clear all items from your cart?')) clearWishlist()
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {localWishlist.map((item) => (
                        <div key={item.wishlist_id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex items-center gap-5 p-5">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.title || 'Package'} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[10px] uppercase font-semibold text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 text-base truncate">{item.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">BDT {Number(item.price).toFixed(2)} per cycle</p>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg">
                                            <button
                                                onClick={() => handleQuantityChange(item.wishlist_id, -1)}
                                                className="p-1.5 text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <MdRemove size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.wishlist_id, 1)}
                                                className="p-1.5 text-slate-500 hover:text-emerald-600 transition-colors"
                                            >
                                                <MdAdd size={14} />
                                            </button>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-400">
                                            {item.quantity > 1 ? `${item.quantity} months duration` : '1 month duration'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 shrink-0">
                                    <p className="font-bold text-slate-900 text-base">
                                        ৳{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeFromWishlist(item.wishlist_id)}
                                        className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <MdDeleteOutline size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24 space-y-6">
                        <h3 className="text-base font-bold text-slate-900">Order Summary</h3>

                        {/* Coupon Code */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <RiCoupon3Line size={12} /> Discount Code
                            </label>
                            {appliedCoupon ? (
                                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                                    <RiCheckLine className="text-emerald-500 shrink-0" size={16} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-emerald-700">{appliedCoupon.code}</p>
                                        <p className="text-xs text-emerald-600 font-medium">
                                            {appliedCoupon.is_percentage ? `${appliedCoupon.discount}% off` : `BDT ${appliedCoupon.discount} off`}
                                        </p>
                                    </div>
                                    <button onClick={removeCoupon} className="text-emerald-400 hover:text-red-500 transition-colors">
                                        <RiCloseLine size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        placeholder="COUPON CODE"
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold tracking-widest focus:outline-none focus:border-emerald-500 transition-colors placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={verifyingCoupon || !couponCode.trim()}
                                        className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all disabled:opacity-40 whitespace-nowrap"
                                    >
                                        {verifyingCoupon ? '...' : 'Apply'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 pt-2 border-t border-slate-50">
                            <div className="flex justify-between text-sm font-medium text-slate-600">
                                <span>Subtotal</span>
                                <span>BDT {subTotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-sm font-semibold text-emerald-600">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>– BDT {discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                                <span>Total</span>
                                <span>BDT {totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {!showCheckout ? (
                            <button
                                onClick={() => setShowCheckout(true)}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout <RiArrowRightLine size={16} />
                            </button>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Payment Method</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['bkash', 'nagad'].map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === method ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                            >
                                                <span className="text-sm font-bold text-slate-700 capitalize">{method}</span>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                                                    {paymentMethod === method && <RiCheckLine className="text-white" size={12} />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-slate-900/10 hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? 'Processing...' : 'Confirm & Place Order'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCheckout(false)}
                                        className="w-full py-3 bg-slate-50 text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-[9px] rounded-xl transition-all"
                                    >
                                        Cancel & Edit Cart
                                    </button>
                                </form>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default WishlistPage