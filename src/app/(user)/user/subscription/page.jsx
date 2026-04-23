'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { RiShieldFlashLine, RiTimeLine, RiCheckLine, RiInformationLine } from 'react-icons/ri'

const ClientSubscription = () => {
    const { isLoggedin } = useContext(Context)
    const [subs, setSubs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSubs = async () => {
        try {
            const res = await axios.get('/api/subscription', { withCredentials: true })
            setSubs(res.data.data)
        } catch (error) {
            console.error('Failed to fetch subscriptions', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoggedin) fetchSubs()
    }, [isLoggedin])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Memberships</h1>
                <p className="text-slate-500 text-sm">Monitor your current services and renewal status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subs.length === 0 ? (
                    <div className="md:col-span-2 p-16 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-4">
                        <RiShieldFlashLine size={48} className="mx-auto text-slate-200" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Memberships</p>
                    </div>
                ) : subs.map((sub, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col gap-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-slate-800">{sub.package_name}</h2>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{sub.status}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                <RiShieldFlashLine size={24} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Started On</p>
                                <p className="text-sm font-bold text-slate-700">{new Date(sub.current_period_start).toLocaleDateString()}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expires On</p>
                                <p className="text-sm font-bold text-slate-700">{new Date(sub.current_period_end).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Entitlements</p>
                            <div className="grid grid-cols-1 gap-2">
                                {sub.features?.slice(0, 4).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                        <RiCheckLine className="text-emerald-500" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="w-full py-4 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-emerald-500 transition-all mt-auto">
                            Manage Renewal
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ClientSubscription