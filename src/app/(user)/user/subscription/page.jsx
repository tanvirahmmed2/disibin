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
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="space-y-4 relative">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Memberships</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Monitor your current services and renewal status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subs.length === 0 ? (
                    <div className="md:col-span-2 p-16 border border-slate-200 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Memberships</p>
                    </div>
                ) : subs.map((sub, i) => {
                    const endDate = new Date(sub.current_period_end)
                    const diffDays = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
                    const needsRenewal = diffDays <= 7 && diffDays > 0
                    const isExpired = diffDays <= 0

                    return (
                        <div key={i} className={`bg-white border p-6 flex flex-col gap-5 transition-all ${needsRenewal ? 'border-amber-300' : isExpired ? 'border-red-300 opacity-75' : 'border-slate-200'}`}>

                            {needsRenewal && (
                                <div className="border border-amber-200 bg-amber-50 px-3 py-2 text-[9px] font-bold flex items-center gap-2 uppercase tracking-widest text-amber-700">
                                    <RiAlertLine size={14} /> Renew within {diffDays} days
                                </div>
                            )}

                            {isExpired && (
                                <div className="border border-red-200 bg-red-50 px-3 py-2 text-[9px] font-bold flex items-center gap-2 uppercase tracking-widest text-red-600">
                                    <RiAlertLine size={14} /> Subscription Expired
                                </div>
                            )}

                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight leading-none mb-1">{sub.package_name}</h2>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {isExpired ? 'Expired' : sub.status}
                                    </p>
                                </div>
                                <div className={`w-10 h-10 border flex items-center justify-center ${isExpired ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                    <RiShieldFlashLine size={18} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-50 border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Started On</p>
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{new Date(sub.current_period_start).toLocaleDateString()}</p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expires On</p>
                                    <p className={`text-xs font-bold uppercase tracking-tight ${needsRenewal ? 'text-amber-600' : isExpired ? 'text-red-500' : 'text-slate-900'}`}>
                                        {new Date(sub.current_period_end).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Plan Entitlements</p>
                                <div className="grid grid-cols-1 gap-1">
                                    {sub.features?.slice(0, 4).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-700 font-bold uppercase tracking-tight">
                                            <RiCheckLine size={12} className="text-emerald-500 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => router.push(`/user/subscription/${sub.subscription_id}`)}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setRenewingSub(sub)}
                                    className={`flex-1 py-2.5 text-white font-bold text-[10px] uppercase tracking-widest transition-all ${needsRenewal ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-800'}`}
                                >
                                    Renew ৳{sub.price}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Renewal Modal */}
            {renewingSub && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 z-[100] p-4">
                    <div className="bg-white p-6 w-full max-w-md border border-slate-200">
                        <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-5 border-b border-slate-100 pb-3">Renew Subscription</h2>

                        <div className="bg-slate-50 border border-slate-200 p-4 mb-5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Plan</span>
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{renewingSub.package_name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Renewal Price</span>
                                <span className="text-base font-bold text-slate-900">৳{renewingSub.price}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Current Expiry</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(renewingSub.current_period_end).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <form onSubmit={handleRenew} className="space-y-4">
                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Payment Method</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="bkash">bKash (Manual)</option>
                                    <option value="nagad">Nagad (Manual)</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="border border-amber-200 bg-amber-50 px-4 py-3">
                                <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mb-1">Send Payment To</p>
                                <p className="text-base font-bold text-amber-800 font-mono tracking-widest">01987131369</p>
                                <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest mt-1">
                                    via {paymentMethod} — exact amount ৳{renewingSub?.price}
                                </p>
                            </div>

                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Transaction ID / Reference</label>
                                <input
                                    type="text"
                                    required
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter transaction ID"
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button type="button" onClick={() => setRenewingSub(null)} className="flex-1 border border-slate-200 text-slate-500 font-bold py-2.5 text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={renewing} className="flex-1 bg-slate-900 text-white font-bold py-2.5 text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50">
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