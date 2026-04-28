'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { 
    RiArrowLeftLine, 
    RiPriceTag3Line, 
    RiMoneyDollarCircleLine, 
    RiShieldFlashLine,
    RiCheckLine,
    RiGlobalLine,
    RiServerLine,
    RiTimeLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const SubscriptionDetails = () => {
    const params = useParams()
    const router = useRouter()
    const id = params.id
    
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/subscription/${id}`, { withCredentials: true })
                setData(res.data.data)
            } catch (error) {
                toast.error('Failed to load subscription details')
                router.push('/user/subscription')
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchData()
    }, [id, router])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    if (!data) return null

    const isExpired = data.package_lifetime ? false : (data.current_period_end ? new Date(data.current_period_end) < new Date() : false)

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.push('/user/subscription')}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    <RiArrowLeftLine size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Subscription #{data.subscription_id}</h1>
                    <p className="text-slate-500 font-medium">Detailed view of your service, package, and connected properties.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Subscription Status */}
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-lg space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <RiShieldFlashLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Service Status</h2>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                            ${isExpired ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                            {isExpired ? 'Expired' : data.status}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Started</p>
                            <p className="text-sm font-semibold text-slate-200">{new Date(data.current_period_start).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expires</p>
                            <p className={`text-sm font-semibold ${isExpired ? 'text-red-400' : 'text-slate-200'}`}>
                                {data.package_lifetime ? 'Lifetime' : new Date(data.current_period_end).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tenant / Workspace */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <RiServerLine size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Assigned Workspace</h2>
                    </div>
                    
                    {data.tenant_id ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Workspace Name</p>
                                <p className="text-lg font-black text-slate-800">{data.tenant_name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-semibold text-emerald-600 uppercase">{data.tenant_status}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Domain</p>
                                    <p className="text-sm font-semibold text-slate-700">{data.tenant_domain || 'Unassigned'}</p>
                                </div>
                            </div>
                            {data.website_id && (
                                <button 
                                    onClick={() => router.push(`/user/website/${data.website_id}`)}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                                >
                                    <RiGlobalLine size={16} /> Manage Website
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-4">
                            <RiGlobalLine size={32} className="text-slate-200 mb-2" />
                            <p className="text-sm font-bold text-slate-400">No workspace connected yet.</p>
                        </div>
                    )}
                </div>

                {/* Package Features */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <RiPriceTag3Line size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Package Details</h2>
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{data.package_name}</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-4">{data.package_description}</p>
                        
                        <div className="space-y-3 mt-6 pt-6 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Features</p>
                            <div className="grid grid-cols-1 gap-2">
                                {data.features?.map((f, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <RiCheckLine className={`mt-0.5 ${f.value ? "text-emerald-500" : "text-slate-300"}`} />
                                        <span className={`text-sm font-medium ${f.value ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{f.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Receipt */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                            <RiMoneyDollarCircleLine size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Initial Receipt</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Paid</span>
                            <span className="text-lg font-black text-emerald-600">৳{data.final_amount}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</span>
                            <span className="text-sm font-semibold text-slate-700">{new Date(data.purchase_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
                            <span className="text-sm font-semibold text-slate-700 uppercase">{data.payment_method || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</span>
                            <span className="text-sm font-mono font-bold text-slate-600">{data.transaction_id || 'N/A'}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SubscriptionDetails
