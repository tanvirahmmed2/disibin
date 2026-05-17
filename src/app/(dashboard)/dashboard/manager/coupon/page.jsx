'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiTag, FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiX, FiPercent, FiDollarSign, FiCalendar,
  FiCheckCircle, FiXCircle, FiUsers,
} from 'react-icons/fi';

// ── form / modal components (all UI sub-components live here) ──────────────
import CouponModal       from '@/component/forms/CouponModal';
import DeleteCouponModal from '@/component/forms/DeleteCouponModal';

// ── tiny pure helpers (no JSX components defined in this file) ─────────────
const fmt     = (n) => (n != null ? Number(n).toLocaleString() : '—');
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

// ── page ───────────────────────────────────────────────────────────────────
const CouponsManagement = () => {
  const [coupons,       setCoupons]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterStatus,  setFilterStatus]  = useState('all');

  // modal visibility
  const [showCreate,    setShowCreate]    = useState(false);
  const [editTarget,    setEditTarget]    = useState(null);   // coupon | null
  const [deleteTarget,  setDeleteTarget]  = useState(null);   // coupon | null
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  // ── data ────────────────────────────────────────────────────────────────
  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/api/coupon');
      if (res.data.success) setCoupons(res.data.data);
    } catch {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  // ── handlers ─────────────────────────────────────────────────────────────
  const handleCreateSuccess = (newCoupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    setShowCreate(false);
  };

  const handleUpdateSuccess = (updated) => {
    setCoupons((prev) =>
      prev.map((c) => (c.coupon_id === updated.coupon_id ? updated : c))
    );
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`/api/coupon?id=${deleteTarget.coupon_id}`);
      if (res.data.success) {
        setCoupons((prev) => prev.filter((c) => c.coupon_id !== deleteTarget.coupon_id));
        toast.success('Coupon deleted');
        setDeleteTarget(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete coupon');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── derived values ───────────────────────────────────────────────────────
  const activeCnt    = coupons.filter((c) => c.status === 'active').length;
  const percentageCnt = coupons.filter((c) => c.is_percentage).length;
  const totalUsed    = coupons.reduce((s, c) => s + (c.used_count || 0), 0);

  const filtered = coupons.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.product_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <FiTag className="text-violet-600" size={18} />
            </span>
            Coupon Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create, manage and track discount coupons</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <FiPlus size={16} /> Create Coupon
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FiTag      className="text-violet-600" size={20} />, label: 'Total Coupons',  value: coupons.length,  bg: 'bg-violet-50'  },
          { icon: <FiCheckCircle className="text-emerald-600" size={20} />, label: 'Active',     value: activeCnt,       bg: 'bg-emerald-50' },
          { icon: <FiPercent  className="text-sky-600"    size={20} />, label: '% Discounts',    value: percentageCnt,   bg: 'bg-sky-50'     },
          { icon: <FiUsers    className="text-amber-600"  size={20} />, label: 'Total Used',     value: totalUsed,       bg: 'bg-amber-50'   },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
            <FiSearch className="text-slate-400 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search code or product..."
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
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading coupons...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiTag size={32} className="text-slate-200" />
                      <span className="text-sm">No coupons found</span>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-xs text-violet-600 hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const usagePct =
                    c.usage_limit > 0
                      ? Math.min(100, Math.round((c.used_count / c.usage_limit) * 100))
                      : null;

                  return (
                    <tr key={c.coupon_id} className="hover:bg-slate-50/60 transition-colors group">

                      {/* Code */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-violet-700 bg-violet-50 px-3 py-1 rounded-lg text-xs tracking-widest">
                          {c.code}
                        </span>
                      </td>

                      {/* Discount */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {c.is_percentage
                            ? <FiPercent size={13} className="text-sky-500" />
                            : <FiDollarSign size={13} className="text-emerald-500" />
                          }
                          <span className="font-bold text-slate-800">
                            {c.is_percentage ? `${fmt(c.discount)}%` : `$${fmt(c.discount)}`}
                          </span>
                          {c.max_discount && (
                            <span className="text-xs text-slate-400">(max ${fmt(c.max_discount)})</span>
                          )}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4">
                        {c.product_name
                          ? <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg text-xs font-semibold">{c.product_name}</span>
                          : <span className="text-slate-400 text-xs">All Products</span>
                        }
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-slate-700 font-medium text-xs">
                            {c.used_count || 0}
                            {c.usage_limit > 0 && <span className="text-slate-400"> / {c.usage_limit}</span>}
                          </span>
                          {usagePct !== null && (
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  usagePct >= 90 ? 'bg-rose-500' : usagePct >= 60 ? 'bg-amber-400' : 'bg-violet-500'
                                }`}
                                style={{ width: `${usagePct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <FiCalendar size={11} className="text-slate-400" />
                          {c.start_date || c.end_date
                            ? <span>{fmtDate(c.start_date)} — {fmtDate(c.end_date)}</span>
                            : <span className="text-slate-400">No expiry</span>
                          }
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {c.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600">
                            <FiCheckCircle size={11} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500">
                            <FiXCircle size={11} /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditTarget(c)}
                            title="Edit Coupon"
                            className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            title="Delete Coupon"
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400">
            Showing {filtered.length} of {coupons.length} coupon{coupons.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* ── Modals (all defined in component/forms, imported above) ── */}
      <CouponModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      <CouponModal
        isOpen={!!editTarget}
        initialData={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={handleUpdateSuccess}
      />

      <DeleteCouponModal
        isOpen={!!deleteTarget}
        coupon={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default CouponsManagement;
