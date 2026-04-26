'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { 
    RiArrowLeftLine, 
    RiUserLine, 
    RiPriceTag3Line, 
    RiMoneyDollarCircleLine, 
    RiShieldFlashLine,
    RiCheckLine,
    RiGlobalLine,
    RiTimeLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const PurchaseDetails = () => {
    const params = useParams()
    const router = useRouter()
    const id = params.id
    
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/purchase/${id}`)
                setData(res.data.data)
            } catch (error) {
                toast.error('Failed to load purchase details')
                router.push('/dashboard/manager/purchases')
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

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.push('/dashboard/manager/purchases')}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    <RiArrowLeftLine size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Purchase #{data.purchase_id}</h1>
                    <p className="text-slate-500 font-medium">Detailed view of order, payment, and subscription status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Package Info */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <RiPriceTag3Line size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Package Details</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">{data.package_name || 'Unknown Package'}</h3>
                                <p className="text-sm text-slate-500 mt-1">{data.package_description}</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-100">
                                    {data.package_lifetime ? 'Lifetime' : `${data.duration_days} Days`}
                                </span>
                                <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-100">
                                    ID: {data.package_id}
                                </span>
                            </div>
                            
                            {data.features && data.features.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Included Features</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {data.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <RiCheckLine className={f.value ? "text-emerald-500" : "text-slate-300"} />
                                                <span className={`text-sm font-medium ${f.value ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{f.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <RiMoneyDollarCircleLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Payment Record</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-lg font-black text-slate-800">৳{data.final_amount}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                <p className={`text-sm font-bold uppercase tracking-widest ${data.payment_status === 'success' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {data.payment_status || 'Pending'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Method</p>
                                <p className="text-sm font-bold text-slate-700 uppercase">{data.payment_method || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction ID</p>
                                <p className="text-sm font-bold text-slate-700">{data.transaction_id || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription & Tenant Info */}
                    {(data.subscription_id || data.tenant_id) && (
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <RiShieldFlashLine size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Provisioning</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {data.subscription_id && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Subscription</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Status</span>
                                                <span className="text-sm font-bold text-emerald-600 uppercase">{data.subscription_status}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Starts</span>
                                                <span className="text-sm font-semibold text-slate-700">{new Date(data.current_period_start).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Ends</span>
                                                <span className="text-sm font-semibold text-slate-700">{data.current_period_end ? new Date(data.current_period_end).toLocaleDateString() : 'Lifetime'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {data.tenant_id && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Tenant (Workspace)</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Name</span>
                                                <span className="text-sm font-bold text-slate-700">{data.tenant_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Status</span>
                                                <span className="text-sm font-bold text-blue-600 uppercase">{data.tenant_status}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Domain</span>
                                                <span className="text-sm font-semibold text-slate-700">{data.tenant_domain || 'Unassigned'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* User Info */}
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <RiUserLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Customer</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</p>
                                <p className="text-base font-bold">{data.user_name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                <p className="text-sm font-medium text-slate-300 break-all">{data.user_email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-sm font-medium text-slate-300">{data.user_phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Info */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                                <RiTimeLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Timeline</h2>
                        </div>
                        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-100">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-slate-200 rounded-full z-10"></div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Placed</p>
                                <p className="text-sm font-semibold text-slate-700">{new Date(data.created_at).toLocaleString()}</p>
                            </div>
                            {data.approved_at && (
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-6 h-6 bg-emerald-500 border-4 border-emerald-100 rounded-full z-10"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approved</p>
                                    <p className="text-sm font-semibold text-slate-700">{new Date(data.approved_at).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseDetails
