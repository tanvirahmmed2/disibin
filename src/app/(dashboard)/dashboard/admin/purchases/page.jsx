'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiShoppingCart, FiSearch, FiX, FiCheckCircle, FiXCircle,
  FiClock, FiAlertCircle
} from 'react-icons/fi';

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [actionLoading, setActionLoading] = useState(null); // purchaseId | null

  useEffect(() => { fetchPurchases(); }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/purchases');
      if (res.data.success) setPurchases(res.data.data);
    } catch {
      toast.error('Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await axios.patch('/api/purchases', { purchaseId: id, status });
      if (res.data.success) {
        toast.success(`Purchase ${status} successfully`);
        setPurchases((prev) =>
          prev.map((p) => (p.purchase_id === id ? { ...p, status } : p))
        );
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = purchases.filter((p) => {
    const matchSearch =
      p.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ['pending', 'approved', 'rejected', 'completed', 'failed', 'refunded'];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
            <FiShoppingCart className="text-violet-600" size={18} />
          </span>
          Purchases
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage product purchases and orders</p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
            <FiSearch className="text-slate-400 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search user or product..."
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
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading purchases...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiShoppingCart size={32} className="text-slate-200" />
                      <span className="text-sm">No purchases found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.purchase_id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{p.user_name || 'Deleted User'}</div>
                      <div className="text-xs text-slate-400">{p.user_email || '—'}</div>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {p.product_name}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ${p.final_amount}
                      {p.discount_amount > 0 && (
                        <span className="text-xs text-slate-400 line-through ml-1">${p.original_amount}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                        p.status === 'approved' || p.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        p.status === 'rejected' || p.status === 'failed' ? 'bg-rose-50 text-rose-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status === 'approved' || p.status === 'completed' ? <FiCheckCircle size={11} /> :
                         p.status === 'pending' ? <FiClock size={11} /> :
                         p.status === 'rejected' || p.status === 'failed' ? <FiXCircle size={11} /> :
                         <FiAlertCircle size={11} />}
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {fmtDate(p.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {p.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateStatus(p.purchase_id, 'approved')}
                            disabled={actionLoading === p.purchase_id}
                            className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(p.purchase_id, 'rejected')}
                            disabled={actionLoading === p.purchase_id}
                            className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
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

export default PurchasesPage;
