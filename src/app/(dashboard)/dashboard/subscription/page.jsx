'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { RiShieldFlashLine, RiCheckLine, RiExchangeLine, RiHistoryLine, RiInformationLine } from 'react-icons/ri'
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

    const activeSub = subscriptions[0] 

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    if (!activeSub) {
        return (
            <div className="space-y-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Membership & Billing</h1>
                    <p className="text-slate-500">You don't have any active subscriptions yet.</p>
                </div>
                
                <div className="bg-white p-16 rounded-[2.5rem] border border-slate-50 shadow-sm text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                        <RiShieldFlashLine size={40} />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Unlock Premium Access</h3>
                        <p className="text-slate-500">Join our membership tiers to get exclusive benefits, priority support, and discounted rates on all digital packages.</p>
                    </div>
                    <Link href="/memberships" className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all">
                        View Membership Plans
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Membership & Billing</h1>
                <p className="text-slate-500">Manage your subscription plans and billing details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                    <RiShieldFlashLine className="absolute -top-10 -right-10 text-white/5" size={300} />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <div className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-2">Current Active Plan</div>
                                <h2 className="text-4xl font-bold tracking-tight">{activeSub.membershipId?.title || 'Custom Plan'}</h2>
                                <span className="text-xs text-slate-400">ID: {activeSub._id}</span>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl backdrop-blur-md font-bold text-sm ${activeSub.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {activeSub.status?.toUpperCase() || 'PENDING'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Payment Status</p>
                                <p className={`font-bold ${activeSub.payStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {activeSub.payStatus?.toUpperCase()}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Billing cycle</p>
                                <p className="font-bold">{activeSub.membershipId?.duration || 'Monthly'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Total Paid</p>
                                <p className="font-bold">${activeSub.total}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs mb-1">TXID</p>
                                <p className="font-bold text-xs truncate max-w-[100px]">{activeSub.transactionId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="flex flex-col gap-4">
                    <Link href="/memberships" className="flex-1 bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center justify-center gap-2 group hover:bg-emerald-600 hover:text-white transition-all text-center">
                        <RiExchangeLine size={24} className="text-emerald-600 group-hover:text-white" />
                        <span className="font-bold">Upgrade Plan</span>
                    </Link>
                    <button className="flex-1 bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center justify-center gap-2 group hover:bg-slate-900 hover:text-white transition-all">
                        <RiHistoryLine size={24} className="text-slate-900 group-hover:text-white" />
                        <span className="font-bold">Payment History</span>
                    </button>
                </div>
            </div>

            {}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-8">What's included in your plan:</h3>
                {activeSub.membershipId?.features?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeSub.membershipId.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                    <RiCheckLine size={16} />
                                </div>
                                <span className="text-slate-600 font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl text-slate-500 italic">
                        <RiInformationLine size={20} />
                        <span>No specific features listed for this plan.</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubscriptionPage
