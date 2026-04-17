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
                <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!activeSub) {
        return (
            <div className="space-y-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Membership & Billing</h1>
                    <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden">You don't have any active subscriptions yet.</p>
                </div>
                
                <div className="bg-white p-16 rounded-[2.5rem] border border-slate-50 shadow-sm text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <RiShieldFlashLine size={40} />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Unlock Premium Access</h3>
                        <p className="text-slate-500 font-medium">Join our membership tiers to get exclusive benefits, priority support, and discounted rates on all digital packages.</p>
                    </div>
                    <Link href="/memberships" className="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
                        View Membership Plans
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Membership & Billing</h1>
                <p className="text-slate-500 font-medium">Manage your subscription plans and billing details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
                    <RiShieldFlashLine className="absolute -top-10 -right-10 text-white/5" size={300} />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <div className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2 px-3 py-1 bg-white/10 rounded-full w-fit">Current Active Plan</div>
                                <h2 className="text-5xl font-black tracking-tighter">{activeSub.membershipId?.title || 'Custom Plan'}</h2>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">ID: {activeSub._id}</span>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl backdrop-blur-md font-black text-[10px] tracking-widest uppercase ${activeSub.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {activeSub.status || 'PENDING'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-white/40 font-black uppercase tracking-widest text-[9px] mb-1">Payment</p>
                                <p className={`font-black uppercase text-xs tracking-wider ${activeSub.payStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {activeSub.payStatus}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/40 font-black uppercase tracking-widest text-[9px] mb-1">Billing</p>
                                <p className="font-black uppercase text-xs tracking-wider">{activeSub.membershipId?.duration || 'Monthly'}</p>
                            </div>
                            <div>
                                <p className="text-white/40 font-black uppercase tracking-widest text-[9px] mb-1">Revenue</p>
                                <p className="font-black uppercase text-xs tracking-wider">${activeSub.total}</p>
                            </div>
                            <div>
                                <p className="text-white/40 font-black uppercase tracking-widest text-[9px] mb-1">TXID</p>
                                <p className="font-black uppercase text-[10px] tracking-widest truncate max-w-[100px] text-white/80">{activeSub.transactionId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Link href="/memberships" className="flex-1 bg-primary p-8 rounded-[2rem] shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-3 group hover:bg-slate-900 transition-all text-center">
                        <RiExchangeLine size={28} className="text-white" />
                        <span className="font-black uppercase tracking-widest text-[11px] text-white">Upgrade Plan</span>
                    </Link>
                    <button className="flex-1 bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col items-center justify-center gap-3 group hover:bg-slate-900 hover:text-white transition-all">
                        <RiHistoryLine size={28} className="text-slate-900 group-hover:text-white" />
                        <span className="font-black uppercase tracking-widest text-[11px] text-slate-800 group-hover:text-white">Billing History</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Plan Benefits & Access</h3>
                {activeSub.membershipId?.features?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeSub.membershipId.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                    <RiCheckLine size={20} />
                                </div>
                                <span className="text-slate-600 font-bold text-sm">{feat}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-8 bg-slate-50 rounded-3xl text-slate-500 font-medium">
                        <RiInformationLine size={24} className="text-primary" />
                        <span>No specific features listed for this core plan. Accessing general benefits...</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SubscriptionPage
