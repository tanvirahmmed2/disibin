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

    // Renewal State
    const [showRenewModal, setShowRenewModal] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('bkash')
    const [transactionId, setTransactionId] = useState('')
    const [renewing, setRenewing] = useState(false)

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

    useEffect(() => {
        if (id) fetchData()
    }, [id, router])

    const handleRenew = async (e) => {
        e.preventDefault()
        setRenewing(true)
        try {
            const payload = {
                items: [{
                    packageId: data.package_id,
                    quantity: 1,
                    price: data.price
                }],
                paymentMethod,
                transactionId,
                subscriptionId: data.subscription_id
            }

            const res = await axios.post('/api/purchase', payload, { withCredentials: true })
            if (res.data.success) {
                toast.success('Renewal request submitted! Awaiting manager approval.')
                setShowRenewModal(false)
                fetchData()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to renew')
        } finally {
            setRenewing(false)
        }
    }

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

                    {!data.package_lifetime && (
                        <button 
                            onClick={() => setShowRenewModal(true)}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Renew Now (৳{data.price})
                        </button>
                    )}
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
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
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

            {/* Renewal Modal */}
            {showRenewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100] p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900">Renew Subscription</h2>
                        
                        <div className="bg-slate-50 p-5 rounded-xl mb-6 space-y-3 border border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Name</span>
                                <span className="text-sm font-bold text-slate-800">{data.package_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Renewal Price</span>
                                <span className="text-sm font-bold text-emerald-600 text-lg">৳{data.price}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Expiry</span>
                                <span className="text-[11px] font-bold text-slate-600">{new Date(data.current_period_end).toLocaleDateString()}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium italic mt-2">
                                * Your new expiration date will be automatically calculated based on your current plan.
                            </p>
                        </div>

                        <form onSubmit={handleRenew} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Payment Method</label>
                                <select
                                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="bkash">bKash (Manual)</option>
                                    <option value="nagad">Nagad (Manual)</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <span className="text-amber-500 text-lg mt-0.5">📲</span>
                                <div>
                                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Send Payment To</p>
                                    <p className="text-base font-black text-amber-800 tracking-widest font-mono">01987131369</p>
                                    <p className="text-[10px] text-amber-600 font-medium mt-1 capitalize">
                                        Send via <strong>{paymentMethod}</strong> — exact amount of <strong>৳{data.price}</strong>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Transaction ID / Reference</label>
                                <input
                                    type="text"
                                    required
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter transaction ID"
                                    className="w-full p-4 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowRenewModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold p-4 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={renewing} className="flex-1 bg-slate-900 text-white font-semibold p-4 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-md">
                                    {renewing ? 'Processing...' : 'Confirm Renewal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SubscriptionDetails
