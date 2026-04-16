'use client'
import React from 'react'
import { RiShieldFlashLine, RiCheckLine, RiExchangeLine, RiHistoryLine } from 'react-icons/ri'

const SubscriptionPage = () => {
    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Membership & Billing</h1>
                <p className="text-slate-500">Manage your subscription plans and billing details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Plan Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                    <RiShieldFlashLine className="absolute -top-10 -right-10 text-white/5" size={300} />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-2">Current Active Plan</div>
                                <h2 className="text-4xl font-bold tracking-tight">Enterprise Elite</h2>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md font-bold text-sm">
                                Renews in 14 days
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Status</p>
                                <p className="font-bold text-emerald-400">Active</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Billing</p>
                                <p className="font-bold">Monthly</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Price</p>
                                <p className="font-bold">$299.00</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Seats</p>
                                <p className="font-bold">Unlimited</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-4">
                    <button className="flex-1 bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center justify-center gap-2 group hover:bg-emerald-600 hover:text-white transition-all">
                        <RiExchangeLine size={24} className="text-emerald-600 group-hover:text-white" />
                        <span className="font-bold">Upgrade Plan</span>
                    </button>
                    <button className="flex-1 bg-white p-6 rounded-3xl border border-slate-50 shadow-sm flex flex-col items-center justify-center gap-2 group hover:bg-slate-900 hover:text-white transition-all">
                        <RiHistoryLine size={24} className="text-slate-900 group-hover:text-white" />
                        <span className="font-bold">Payment History</span>
                    </button>
                </div>
            </div>

            {/* Plan Benefits */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-8">What's included in your plan:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['Priority 24/7 Support', 'Dedicated Project Manager', 'Unlimited Revisions', 'Early Beta Access', 'Cloud Backup Integration'].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                <RiCheckLine size={16} />
                            </div>
                            <span className="text-slate-600 font-medium">{feat}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SubscriptionPage
