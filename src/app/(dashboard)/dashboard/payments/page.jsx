'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
    RiMoneyDollarCircleLine, 
    RiRefreshLine, 
    RiCheckLine, 
    RiTimeLine, 
    RiCloseLine,
    RiArrowGoBackLine,
    RiSearch2Line,
    RiFilterLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

/* ─── Summary Card ───────────────────────────────────────────────────── */
const SummaryCard = ({ label, amount, color, icon: Icon }) => (
    <div className={`bg-white p-6 rounded-[1.75rem] border border-slate-100 shadow-sm flex items-center gap-5`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-800">৳{Number(amount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
    </div>
)

/* ─── Status Badge ───────────────────────────────────────────────────── */
const Badge = ({ status }) => {
    const map = {
        success:  'bg-emerald-50 text-emerald-600 border-emerald-100',
        pending:  'bg-amber-50 text-amber-600 border-amber-100',
        failed:   'bg-red-50 text-red-500 border-red-100',
        refunded: 'bg-purple-50 text-purple-500 border-purple-100',
    }
    return (
        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${map[status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
            {status}
        </span>
    )
}

/* ─── Page ───────────────────────────────────────────────────────────── */
const PaymentsPage = () => {
    const [payments, setPayments] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterMethod, setFilterMethod] = useState('')
    const [updatingId, setUpdatingId] = useState(null)

    const fetchPayments = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filterStatus) params.set('status', filterStatus)
            if (filterMethod) params.set('method', filterMethod)
            const res = await axios.get(`/api/payment?${params.toString()}`)
            setPayments(res.data.data || [])
            setSummary(res.data.summary || null)
        } catch (error) {
            toast.error('Failed to load payments')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPayments() }, [filterStatus, filterMethod])

    const handleStatusUpdate = async (paymentId, newStatus) => {
        if (!window.confirm(`Mark this payment as "${newStatus}"?`)) return
        setUpdatingId(paymentId)
        try {
            const res = await axios.patch('/api/payment', { id: paymentId, status: newStatus })
            if (res.data.success) {
                toast.success(`Payment marked as ${newStatus}`)
                fetchPayments()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update')
        } finally {
            setUpdatingId(null)
        }
    }

    const filtered = payments.filter(p => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
            (p.user_name || '').toLowerCase().includes(q) ||
            (p.user_email || '').toLowerCase().includes(q) ||
            (p.transaction_id || '').toLowerCase().includes(q) ||
            (p.package_name || '').toLowerCase().includes(q)
        )
    })

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Payment History</h1>
                    <p className="text-slate-500 font-medium mt-1">All payment transactions across the platform.</p>
                </div>
                <button onClick={fetchPayments}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm">
                    <RiRefreshLine size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard label="Collected" amount={summary.total_success} color="bg-emerald-50 text-emerald-500" icon={RiCheckLine} />
                    <SummaryCard label="Pending" amount={summary.total_pending} color="bg-amber-50 text-amber-500" icon={RiTimeLine} />
                    <SummaryCard label="Failed" amount={summary.total_failed} color="bg-red-50 text-red-500" icon={RiCloseLine} />
                    <SummaryCard label="Refunded" amount={summary.total_refunded} color="bg-purple-50 text-purple-500" icon={RiArrowGoBackLine} />
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                    <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, email, transaction ID, package..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-300 focus:bg-white transition-colors placeholder:text-slate-300"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <RiFilterLine className="text-slate-300 shrink-0" size={18} />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-none focus:border-emerald-300 focus:bg-white transition-colors">
                        <option value="">All Statuses</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-none focus:border-emerald-300 focus:bg-white transition-colors">
                        <option value="">All Methods</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="bank">Bank</option>
                        <option value="manual">Manual</option>
                        <option value="stripe">Stripe</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <RiMoneyDollarCircleLine size={40} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">No payments found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-50 text-left">
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Customer</th>
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Package</th>
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Amount</th>
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Method</th>
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Transaction ID</th>
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Status</th>
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Date</th>
                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(pay => (
                                    <tr key={pay.payment_id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{pay.user_name || 'Unknown'}</span>
                                                <span className="text-xs text-slate-400 font-medium">{pay.user_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-slate-700">{pay.package_name || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-emerald-600 text-base">৳{Number(pay.amount).toFixed(2)}</span>
                                            {Number(pay.discount_amount) > 0 && (
                                                <span className="ml-2 text-[10px] font-bold text-purple-500">-৳{Number(pay.discount_amount).toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                {pay.method || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                {pay.transaction_id || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={pay.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold text-slate-500">
                                                {new Date(pay.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {pay.status === 'pending' && (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        disabled={updatingId === pay.payment_id}
                                                        onClick={() => handleStatusUpdate(pay.payment_id, 'success')}
                                                        className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 uppercase tracking-widest"
                                                    >
                                                        ✓ Approve
                                                    </button>
                                                    <button
                                                        disabled={updatingId === pay.payment_id}
                                                        onClick={() => handleStatusUpdate(pay.payment_id, 'failed')}
                                                        className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 uppercase tracking-widest"
                                                    >
                                                        ✗ Reject
                                                    </button>
                                                </div>
                                            )}
                                            {pay.status === 'success' && (
                                                <button
                                                    disabled={updatingId === pay.payment_id}
                                                    onClick={() => handleStatusUpdate(pay.payment_id, 'refunded')}
                                                    className="px-3 py-1.5 bg-purple-50 text-purple-500 border border-purple-100 text-[10px] font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-50 uppercase tracking-widest"
                                                >
                                                    Refund
                                                </button>
                                            )}
                                            {(pay.status === 'failed' || pay.status === 'refunded') && (
                                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
                            Showing {filtered.length} of {payments.length} transactions
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentsPage
