'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    RiShieldFlashLine,
    RiCheckLine,
    RiExchangeLine,
    RiHistoryLine,
    RiInformationLine
} from 'react-icons/ri'
import Link from 'next/link'

const SubscriptionPage = () => {
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await axios.get('/api/subscription')
                if (res.data.success) {
                    setSubscriptions(res.data.payload)
                }
            } catch (error) {
                console.error("Error fetching subscriptions", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSubscriptions()
    }, [])

    const activeSub = subscriptions.find(sub =>
        sub.status === "confirmed" &&
        sub.payStatus === "completed"
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!activeSub) {
        return (
            <div className="space-y-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Membership & Billing</h1>
                    <p className="text-slate-500">You don't have any active subscriptions yet.</p>
                </div>

                <div className="bg-white p-16 rounded-[2.5rem] border shadow-sm text-center flex flex-col items-center gap-6">
                    <RiShieldFlashLine size={40} className="text-emerald-500" />

                    <h3 className="text-2xl font-black">Unlock Premium Access</h3>

                    <p className="text-slate-500 max-w-md">
                        Join membership plans for exclusive benefits and priority support.
                    </p>

                    <Link
                        href="/memberships"
                        className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl"
                    >
                        View Plans
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10">

            <div>
                <h1 className="text-3xl font-black">Membership & Billing</h1>
                <p className="text-slate-500">Manage your subscription details.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 bg-slate-900 text-white p-10 rounded-[2.5rem]">
                    <h2 className="text-4xl font-black">
                        {activeSub.membershipId?.title}
                    </h2>

                    <p className="text-xs text-white/50 mt-2">
                        ID: {activeSub._id}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mt-10 text-sm">

                        <div>
                            <p className="text-white/40">Payment</p>
                            <p>{activeSub.payStatus}</p>
                        </div>

                        <div>
                            <p className="text-white/40">Duration</p>
                            <p>{activeSub.membershipId?.duration} days</p>
                        </div>

                        <div>
                            <p className="text-white/40">Total</p>
                            <p>${activeSub.total}</p>
                        </div>

                        <div>
                            <p className="text-white/40">Expires</p>
                            <p>
                                {activeSub.expiresAt
                                    ? new Date(activeSub.expiresAt).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col gap-4">

                    <Link
                        href="/memberships"
                        className="bg-emerald-500 text-white p-6 rounded-2xl font-bold text-center"
                    >
                        Upgrade Plan
                    </Link>

                    <button className="bg-white p-6 rounded-2xl border">
                        Billing History
                    </button>

                </div>

            </div>

            <div className="bg-white p-10 rounded-3xl border">
                <h3 className="text-xl font-black mb-6">Plan Features</h3>

                {activeSub.membershipId?.features?.length ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {activeSub.membershipId.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <RiCheckLine className="text-emerald-500" />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500">No features available</p>
                )}
            </div>

        </div>
    )
}

export default SubscriptionPage