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
        <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-colors
            ${done ? 'bg-emerald-500 border-emerald-500 text-white' : active ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            {done ? <RiCheckLine size={12} /> : n}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
    </div>
)

const StepDivider = () => <div className="flex-1 h-px bg-slate-200" />

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
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Process Refund</h1>
                <p className="text-xs text-slate-500 mt-1">Cancel a subscription and issue a refund. This will delete all workspace data.</p>
            </div>

            {!done && (
                <div className="flex items-center gap-4 bg-white p-4 border border-slate-200">
                    <StepBadge n={1} label="Find User"  active={step === 1} done={step > 1} />
                    <StepDivider />
                    <StepBadge n={2} label="Subscription" active={step === 2} done={step > 2} />
                    <StepDivider />
                    <StepBadge n={3} label="Confirm" active={step === 3} done={false} />
                </div>
            )}

            {/* ── Step 1: Email Search ─────────────────────────────────── */}
            {!done && step === 1 && (
                <div className="bg-white p-8 border border-slate-200 space-y-6">
                    <div className="flex items-center gap-3">
                        <RiSearch2Line size={18} className="text-slate-400" />
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Find Customer</h2>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="customer@example.com"
                            className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                        />
                        <button type="submit" disabled={loading}
                            className="px-6 py-2 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2">
                            {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiSearch2Line size={14} />}
                            Search
                        </button>
                    </form>
                </div>
            )}

            {/* ── Step 2: Pick Subscription ────────────────────────────── */}
            {!done && step === 2 && searchResult && (
                <div className="space-y-4">
                    <div className="bg-slate-900 p-4 text-white flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center shrink-0">
                            <RiUserLine size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm uppercase tracking-tight">{searchResult.user.name}</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{searchResult.user.email}</p>
                        </div>
                        <button onClick={() => setStep(1)} className="p-2 border border-white/10 hover:bg-white/10 transition-all">
                            <RiArrowLeftLine size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1">
                            {searchResult.subscriptions.length} Active Subscription{searchResult.subscriptions.length !== 1 ? 's' : ''}
                        </p>
                        {searchResult.subscriptions.map(sub => {
                            const prorated = calcProrated(sub)
                            return (
                                <div key={sub.subscription_id}
                                    className="bg-white border border-slate-200 p-6 hover:border-slate-400 transition-all cursor-pointer group"
                                    onClick={() => handleSelectSub(sub)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                                                <RiShieldFlashLine size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm uppercase tracking-tight">{sub.package_name || 'Package'}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: #{sub.subscription_id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-600">৳{prorated.toFixed(2)}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Est. Refund</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Paid</p>
                                            <p className="text-xs font-bold text-slate-800">৳{Number(sub.paid_amount || 0).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expires</p>
                                            <p className="text-xs font-bold text-slate-800">{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'Lifetime'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Workspace</p>
                                            <p className="text-xs font-bold text-slate-800 truncate">{sub.tenant_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Step 3: Confirm ──────────────────────────────────────── */}
            {!done && step === 3 && selectedSub && (
                <div className="space-y-4">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-800 transition-all uppercase tracking-widest">
                        <RiArrowLeftLine size={12} /> Back to subscriptions
                    </button>

                    <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-100">
                        <RiAlertLine size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-bold text-red-700 text-xs uppercase tracking-tight">Destructive Action</p>
                            <p className="text-red-600 text-[10px] font-bold leading-relaxed uppercase tracking-tighter">
                                Cancellation will permanently delete workspace "{selectedSub.tenant_name || 'N/A'}" and all data.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 border border-slate-200 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <RiMoneyDollarCircleLine size={18} className="text-slate-400" />
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Refund Summary</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {[
                                ['Customer', searchResult.user.name],
                                ['Package', selectedSub.package_name || 'N/A'],
                                ['Total Paid', `৳${Number(selectedSub.paid_amount || 0).toFixed(2)}`],
                                ['Method', (selectedSub.payment_method || 'N/A').toUpperCase()],
                                ['Transaction', selectedSub.transaction_id || 'N/A'],
                                ['Workspace', selectedSub.tenant_name || 'N/A'],
                            ].map(([label, val]) => (
                                <div key={label} className="bg-slate-50 p-3 border border-slate-100">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                                    <p className="text-xs font-bold text-slate-800 truncate uppercase tracking-tight">{val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Refund Amount (৳)</label>
                            <input
                                type="number"
                                value={refundAmount}
                                onChange={e => setRefundAmount(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xl font-bold text-emerald-600 focus:outline-none focus:border-slate-400 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Reason</label>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                rows={2}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all resize-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleRefund}
                                disabled={processing}
                                className="flex-1 py-3 bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Confirm Refund & Cancel'}
                            </button>
                            <button onClick={() => setStep(2)} disabled={processing}
                                className="px-6 py-3 border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Done ─────────────────────────────────────────────────── */}
            {done && (
                <div className="bg-white p-12 border border-slate-200 text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
                        <RiCheckLine size={24} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Refund Processed</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">৳{refundAmount} Refunded · Subscription Cancelled</p>
                    </div>
                    <button onClick={handleReset}
                        className="px-6 py-2 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">
                        Process Another
                    </button>
                </div>
            )}
        </div>
    )
}

export default RefundPage
