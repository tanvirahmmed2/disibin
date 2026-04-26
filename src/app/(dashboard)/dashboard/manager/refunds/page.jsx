'use client'
import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    RiSearch2Line,
    RiShieldFlashLine,
    RiMoneyDollarCircleLine,
    RiCheckLine,
    RiArrowRightLine,
    RiArrowLeftLine,
    RiUserLine,
    RiServerLine,
    RiAlertLine,
    RiRefundLine
} from 'react-icons/ri'

/* ─── Step Indicator ─────────────────────────────────────────────────── */
const StepBadge = ({ n, label, active, done }) => (
    <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors
            ${done ? 'bg-emerald-500 text-white' : active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {done ? <RiCheckLine size={16} /> : n}
        </div>
        <span className={`text-sm font-bold hidden sm:block ${active ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
    </div>
)

const StepDivider = () => <div className="flex-1 h-px bg-slate-200 mx-2" />

/* ─── Pro-rated balance calculator ──────────────────────────────────── */
const calcProrated = (sub) => {
    if (!sub.current_period_start || !sub.current_period_end) return Number(sub.paid_amount || 0)
    const start = new Date(sub.current_period_start).getTime()
    const end   = new Date(sub.current_period_end).getTime()
    const now   = Date.now()
    const total = end - start
    const remaining = Math.max(0, end - now)
    const pct = total > 0 ? remaining / total : 0
    return +(Number(sub.paid_amount || 0) * pct).toFixed(2)
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
const RefundPage = () => {
    const [step, setStep] = useState(1)           // 1=email, 2=pick sub, 3=confirm
    const [email, setEmail] = useState('')
    const [searchResult, setSearchResult] = useState(null)   // { user, subscriptions }
    const [selectedSub, setSelectedSub] = useState(null)
    const [refundAmount, setRefundAmount] = useState('')
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [done, setDone] = useState(false)

    /* Step 1 — search by email */
    const handleSearch = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSearchResult(null)
        try {
            const res = await axios.get(`/api/refund?email=${encodeURIComponent(email.trim())}`)
            if (res.data.success) {
                setSearchResult(res.data.data)
                setStep(2)
                if (res.data.data.subscriptions.length === 0) {
                    toast('No active subscriptions found for this user.', { icon: '⚠️' })
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'User not found')
        } finally {
            setLoading(false)
        }
    }

    /* Step 2 — select subscription */
    const handleSelectSub = (sub) => {
        setSelectedSub(sub)
        const prorated = calcProrated(sub)
        setRefundAmount(prorated.toString())
        setStep(3)
    }

    /* Step 3 — confirm & process */
    const handleRefund = async () => {
        if (!refundAmount || isNaN(refundAmount) || Number(refundAmount) <= 0) {
            return toast.error('Enter a valid refund amount')
        }
        if (!window.confirm(`⚠️ This will:\n• Cancel subscription #${selectedSub.subscription_id}\n• Refund ৳${refundAmount}\n• Delete the workspace and all its data\n\nAre you absolutely sure?`)) return

        setProcessing(true)
        try {
            const res = await axios.post('/api/refund', {
                subscription_id: selectedSub.subscription_id,
                payment_id: selectedSub.payment_id,
                refund_amount: Number(refundAmount),
                reason: reason.trim() || 'Manager-initiated refund'
            })
            if (res.data.success) {
                toast.success(res.data.message)
                setDone(true)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Refund failed')
        } finally {
            setProcessing(false)
        }
    }

    /* Reset */
    const handleReset = () => {
        setStep(1); setEmail(''); setSearchResult(null)
        setSelectedSub(null); setRefundAmount(''); setReason(''); setDone(false)
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Process Refund</h1>
                <p className="text-slate-500 font-medium mt-1">Cancel a subscription and issue a refund. This will delete all workspace data.</p>
            </div>

            {/* Step Indicator */}
            {!done && (
                <div className="flex items-center bg-white p-5 rounded-[1.75rem] border border-slate-100 shadow-sm">
                    <StepBadge n={1} label="Find User"  active={step === 1} done={step > 1} />
                    <StepDivider />
                    <StepBadge n={2} label="Select Subscription" active={step === 2} done={step > 2} />
                    <StepDivider />
                    <StepBadge n={3} label="Confirm Refund" active={step === 3} done={false} />
                </div>
            )}

            {/* ── Step 1: Email Search ─────────────────────────────────── */}
            {!done && step === 1 && (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                            <RiSearch2Line size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Find Customer</h2>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="customer@example.com"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors placeholder:text-slate-300"
                        />
                        <button type="submit" disabled={loading}
                            className="px-8 py-4 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center gap-2">
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiSearch2Line size={18} />}
                            Search
                        </button>
                    </form>
                </div>
            )}

            {/* ── Step 2: Pick Subscription ────────────────────────────── */}
            {!done && step === 2 && searchResult && (
                <div className="space-y-6">
                    {/* User Card */}
                    <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                            <RiUserLine size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xl font-black">{searchResult.user.name}</p>
                            <p className="text-slate-400 text-sm font-medium">{searchResult.user.email}</p>
                        </div>
                        <button onClick={() => setStep(1)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                            <RiArrowLeftLine size={18} />
                        </button>
                    </div>

                    {/* Subscriptions */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                            {searchResult.subscriptions.length} Active Subscription{searchResult.subscriptions.length !== 1 ? 's' : ''} — Select one to refund
                        </p>
                        {searchResult.subscriptions.length === 0 && (
                            <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center shadow-sm">
                                <RiShieldFlashLine size={40} className="text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-semibold">No active subscriptions to refund.</p>
                            </div>
                        )}
                        {searchResult.subscriptions.map(sub => {
                            const prorated = calcProrated(sub)
                            const isExpiring = sub.current_period_end && new Date(sub.current_period_end) < new Date(Date.now() + 7 * 86400000)
                            return (
                                <div key={sub.subscription_id}
                                    className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => handleSelectSub(sub)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                                <RiShieldFlashLine size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-lg">{sub.package_name || 'Package'}</p>
                                                <p className="text-sm text-slate-400 font-medium">Sub #{sub.subscription_id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-emerald-600">৳{prorated.toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Est. Refund</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-5 border-t border-slate-50 grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Paid</p>
                                            <p className="text-sm font-bold text-slate-700">৳{Number(sub.paid_amount || 0).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expires</p>
                                            <p className={`text-sm font-bold ${isExpiring ? 'text-amber-500' : 'text-slate-700'}`}>
                                                {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'Lifetime'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Workspace</p>
                                            <p className="text-sm font-bold text-slate-700 truncate">{sub.tenant_name || 'None'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-end gap-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-bold">Select for Refund</span>
                                        <RiArrowRightLine size={16} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Step 3: Confirm ──────────────────────────────────────── */}
            {!done && step === 3 && selectedSub && (
                <div className="space-y-6">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors">
                        <RiArrowLeftLine size={16} /> Back to subscriptions
                    </button>

                    {/* Warning banner */}
                    <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                        <RiAlertLine size={22} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-black text-red-700 text-sm">Destructive Action</p>
                            <p className="text-red-500 text-xs font-medium mt-1 leading-relaxed">
                                Confirming will cancel subscription #{selectedSub.subscription_id}, mark the payment as refunded, 
                                and <strong>permanently delete the workspace "{selectedSub.tenant_name || 'N/A'}"</strong> along with all its websites and users.
                            </p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                <RiMoneyDollarCircleLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Refund Details</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {[
                                ['Customer', searchResult.user.name],
                                ['Package', selectedSub.package_name || 'N/A'],
                                ['Total Paid', `৳${Number(selectedSub.paid_amount || 0).toFixed(2)}`],
                                ['Payment Method', (selectedSub.payment_method || 'N/A').toUpperCase()],
                                ['Transaction ID', selectedSub.transaction_id || 'N/A'],
                                ['Workspace', selectedSub.tenant_name || 'None'],
                            ].map(([label, val]) => (
                                <div key={label} className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                                    <p className="font-bold text-slate-800 truncate">{val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Refund Amount */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Refund Amount (৳) — pre-filled with pro-rated balance
                            </label>
                            <input
                                type="number"
                                value={refundAmount}
                                onChange={e => setRefundAmount(e.target.value)}
                                min="0.01"
                                step="0.01"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-2xl font-black text-emerald-600 focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors"
                            />
                            <p className="text-xs text-slate-400 font-medium">
                                Remaining pro-rated value: ৳{calcProrated(selectedSub).toFixed(2)} 
                                {' '}(based on days left in billing period)
                            </p>
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Refund Reason</label>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="e.g. Customer requested cancellation within cooling-off period..."
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-emerald-400 focus:bg-white transition-colors resize-none placeholder:text-slate-300"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRefund}
                                disabled={processing}
                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500 text-white font-black text-sm rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-red-500/20"
                            >
                                {processing
                                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                                    : <><RiRefundLine size={18} /> Confirm Refund & Cancel</>
                                }
                            </button>
                            <button onClick={() => setStep(2)} disabled={processing}
                                className="px-8 py-4 bg-slate-100 text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Done ─────────────────────────────────────────────────── */}
            {done && (
                <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                        <RiCheckLine size={40} className="text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Refund Processed</h2>
                        <p className="text-slate-500 font-medium mt-2">
                            ৳{refundAmount} refunded · Subscription cancelled · Workspace deleted.
                        </p>
                    </div>
                    <button onClick={handleReset}
                        className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all uppercase tracking-widest text-sm">
                        Process Another Refund
                    </button>
                </div>
            )}
        </div>
    )
}

export default RefundPage
