'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiCreditCard, FiSearch, FiX, FiCheckCircle, FiXCircle,
  FiClock, FiAlertCircle
} from 'react-icons/fi';

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

const ManagerPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/api/payments');
      if (res.data.success) setPayments(res.data.data);
    } catch {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ['pending', 'success', 'failed', 'refunded'];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
            <FiCreditCard className="text-violet-600" size={18} />
          </span>
          Payments (Manager)
        </h1>
        <p className="text-slate-500 text-sm mt-1">Monitor payment transactions</p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
            <FiSearch className="text-slate-400 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search user or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white outline-none focus:ring-2 focus:ring-violet-500 transition-all capitalize"
          >
            <option value="all">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method / Provider</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading payments...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiCreditCard size={32} className="text-slate-200" />
                      <span className="text-sm">No payments found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{p.user_name || 'Deleted User'}</div>
                      <div className="text-xs text-slate-400">{p.user_email || '—'}</div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ${p.amount} <span className="text-xs text-slate-400">{p.currency}</span>
                    </td>

                    {/* Method */}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="font-medium capitalize">{p.method || '—'}</div>
                      <div className="text-xs text-slate-400 capitalize">{p.provider || '—'}</div>
                    </td>

                    {/* Transaction ID */}
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {p.transaction_id || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                        p.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                        p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        p.status === 'failed' ? 'bg-rose-50 text-rose-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status === 'success' ? <FiCheckCircle size={11} /> :
                         p.status === 'pending' ? <FiClock size={11} /> :
                         p.status === 'failed' ? <FiXCircle size={11} /> :
                         <FiAlertCircle size={11} />}
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {fmtDate(p.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerPaymentsPage;
