'use client'
import { Context } from '@/component/helper/Context'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'
import axios from 'axios'

const WishlistPage = () => {
    const { removeFromwishlist, wishlist, clearWishlist, userData } = useContext(Context)

    const [isPopUp, setIsPopUp] = useState(false)
    const [payment_method, setPayment_method] = useState('bkash')

    const subTotal = wishlist.reduce((acc, item) => acc + (Number(item.price) || 0), 0)
    const totalAmount = subTotal

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!userData?._id) {
            alert("Please login first")
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
                alert("Order placed successfully!")
                clearWishlist()
                setIsPopUp(false)
            }
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to place order')
        }
    }

    return (
        <div className="w-full p-4 relative pt-24 pb-20">
            <h1 className="text-3xl font-black mb-12 text-slate-900 tracking-tighter">
                My Wishlist <span className="text-emerald-500 ml-2">({wishlist.length})</span>
            </h1>

            {wishlist.length > 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    <div className='lg:col-span-2 space-y-6'>
                        {wishlist.map((item) => (
                            <div key={item._id} className="w-full flex items-center gap-8 p-8 bg-white border rounded-[2.5rem] hover:shadow-xl">
                                
                                <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-slate-50 shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.title} fill className='object-cover' />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-xs">
                                            {item.type}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <Link href={`/${item.type}s/${item.slug}`} className='text-lg font-bold hover:text-emerald-500'>
                                        {item.title}
                                    </Link>

                                    <div className="mt-2 font-bold">
                                        BDT {item.price}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => removeFromwishlist(item._id)}
                                    className='p-3 bg-red-500 text-white rounded-xl hover:bg-red-600'
                                >
                                    <MdDeleteOutline size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-3xl border shadow">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Total Items</span>
                                <span>{wishlist.length}</span>
                            </div>

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>BDT {totalAmount}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPopUp(true)}
                            className="w-full mt-6 py-4 bg-emerald-500 text-white rounded-xl"
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20">
                    <h3 className="text-xl font-bold">Wishlist is empty</h3>
                    <Link href="/packages" className="mt-4 inline-block text-emerald-500">
                        Browse Packages
                    </Link>
                </div>
            )}

            {isPopUp && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md">

                        <h2 className="text-xl font-bold mb-4">Complete Purchase</h2>

                        <div className="mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>BDT {subTotal}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
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