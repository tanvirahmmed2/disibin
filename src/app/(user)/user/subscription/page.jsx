'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { RiShieldFlashLine, RiTimeLine, RiCheckLine, RiInformationLine, RiAlertLine } from 'react-icons/ri'
import { useRouter } from 'next/navigation'

const ClientSubscription = () => {
    const router=useRouter()
    const { isLoggedIn } = useContext(Context)
    const [subs, setSubs] = useState([])
    const [loading, setLoading] = useState(true)

    // Renewal Modal State
    const [renewingSub, setRenewingSub] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('bkash')
    const [transactionId, setTransactionId] = useState('')
    const [renewing, setRenewing] = useState(false)

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
        if (isLoggedIn) fetchSubs()
    }, [isLoggedIn])

    const handleRenew = async (e) => {
        e.preventDefault()
        setRenewing(true)
        try {
            const data = {
                items: [{
                    packageId: renewingSub.package_id,
                    quantity: 1, // Standard 1 cycle renewal
                    price: renewingSub.price // Just for reference, backend recalculates
                }],
                paymentMethod,
                transactionId,
                subscriptionId: renewingSub.subscription_id
            }

            const res = await axios.post('/api/purchase', data, { withCredentials: true })
            if (res.data.success) {
                toast.success('Renewal successful!')
                setRenewingSub(null)
                fetchSubs()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to renew')
        } finally {
            setRenewing(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-10 relative">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Memberships</h1>
                <p className="text-slate-500 text-sm font-medium">Monitor your current services and renewal status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subs.length === 0 ? (
                    <div className="md:col-span-2 p-16 border-2 border-dashed border-slate-100 rounded-2xl text-center space-y-4">
                        <RiShieldFlashLine size={48} className="mx-auto text-slate-200" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Memberships</p>
                    </div>
                ) : subs.map((sub, i) => {
                    // Check if expiring within 7 days
                    const endDate = new Date(sub.current_period_end)
                    const diffDays = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
                    const needsRenewal = diffDays <= 7 && diffDays > 0
                    const isExpired = diffDays <= 0

                    return (
                        <div key={i} className={`bg-white border rounded-2xl p-8 flex flex-col gap-6 transition-all ${needsRenewal ? 'border-amber-400 shadow-md shadow-amber-500/10' : isExpired ? 'border-red-400 opacity-70' : 'border-slate-200 shadow-sm'}`}>
                            
                            {needsRenewal && (
                                <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold flex items-center gap-2 uppercase tracking-widest border border-amber-100 -mt-2 -mx-2 mb-2">
                                    <RiAlertLine size={16} /> Renew within {diffDays} days to avoid service interruption
                                </div>
                            )}

                            {isExpired && (
                                <div className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold flex items-center gap-2 uppercase tracking-widest border border-red-100 -mt-2 -mx-2 mb-2">
                                    <RiAlertLine size={16} /> Subscription Expired
                                </div>
                            )}

                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-slate-800">{sub.package_name}</h2>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {isExpired ? 'Expired' : sub.status}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isExpired ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
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
                                    <p className={`text-sm font-bold ${needsRenewal ? 'text-amber-600' : isExpired ? 'text-red-500' : 'text-slate-700'}`}>
                                        {new Date(sub.current_period_end).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Entitlements</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {sub.features?.slice(0, 4).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <RiCheckLine className="text-emerald-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button 
                                    onClick={() => router.push(`/user/subscription/${sub.subscription_id}`)}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm uppercase tracking-widest rounded-xl transition-all"
                                >
                                    View Details
                                </button>
                                <button 
                                    onClick={() => setRenewingSub(sub)}
                                    className={`flex-1 py-4 text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all ${needsRenewal ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-emerald-600'}`}
                                >
                                    Renew (৳{sub.price})
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Renewal Modal */}
            {renewingSub && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-[100] p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900">Renew Subscription</h2>
                        
                        <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 border border-slate-100">
                            <p className="text-sm font-medium text-slate-600">You are renewing <strong>{renewingSub.package_name}</strong> for 1 cycle.</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">New Expiry will be calculated based on your plan.</p>
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

                            {/* Send money instruction */}
                            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <span className="text-amber-500 text-lg mt-0.5">📲</span>
                                <div>
                                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Send Payment To</p>
                                    <p className="text-base font-black text-amber-800 tracking-widest font-mono">01987131369</p>
                                    <p className="text-[10px] text-amber-600 font-medium mt-1 capitalize">
                                        Send via <strong>{paymentMethod}</strong> — exact amount of <strong>৳{renewingSub?.price}</strong>
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
                                <button type="button" onClick={() => setRenewingSub(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold p-4 rounded-xl transition-colors">
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

export default ClientSubscription