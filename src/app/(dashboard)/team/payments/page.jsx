'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCreditCard, FiCheckCircle, FiAlertCircle, FiSearch, FiDollarSign, FiEdit2, FiUser, FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TeamPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingPayment, setEditingPayment] = useState(null);
  const [newPaid, setNewPaid] = useState('');
  const [newStatus, setNewStatus] = useState('paid');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/api/team/payments');
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch {
      toast.error('Failed to load payment transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!editingPayment) return;

    setUpdating(true);
    try {
      const res = await axios.patch('/api/team/projects/payment', {
        payment_id: editingPayment.payment_id,
        paid: Number(newPaid),
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setEditingPayment(null);
        fetchPayments();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment');
    } finally {
      setUpdating(false);
    }
  };

  const filteredPayments = payments.filter((item) => {
    const textMatch = (
      (item.user_name || '') +
      ' ' +
      (item.user_email || '') +
      ' ' +
      (item.project_title || '') +
      ' ' +
      (item.product_title || '')
    )
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const status = (item.payment_status || '').toLowerCase();
    if (statusFilter === 'paid') return textMatch && status === 'paid';
    if (statusFilter === 'due') return textMatch && (status === 'due' || status === 'unpaid');
    return textMatch;
  });

  // Calculate Metrics
  const totalRevenue = payments.reduce((sum, item) => sum + Number(item.paid_amount || 0), 0);
  const totalOutstanding = payments.reduce((sum, item) => sum + Number(item.due_amount || 0), 0);
  const paidCount = payments.filter((item) => item.payment_status === 'paid').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FiCreditCard className="text-primary" /> Payments & Financial Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Monitor customer payments, manage due balances, and update invoice records
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
            <FiDollarSign size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">${totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-secondary/10 text-secondary">
            <FiAlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Dues</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">${totalOutstanding.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid Invoices</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{paidCount} Record{paidCount === 1 ? '' : 's'}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search customer, project, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {['all', 'paid', 'due'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3"></div>
          <p className="text-slate-500 text-sm font-medium">Loading payments ledger...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <FiCreditCard size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Payment Records</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            No transactions match the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Customer & Project</th>
                  <th className="py-4 px-6">Total Price</th>
                  <th className="py-4 px-6">Paid</th>
                  <th className="py-4 px-6">Due</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPayments.map((item) => (
                  <tr key={item.payment_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FiUser className="text-primary" size={14} /> {item.user_name || 'Customer User'}
                          <span className="text-slate-400 font-normal text-xs">({item.user_email || 'N/A'})</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <FiFolder size={12} /> {item.project_title || item.product_title || 'Project Solution'}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      ${Number(item.total_price || 0).toLocaleString()}
                    </td>

                    <td className="py-4 px-6 font-bold text-primary">
                      ${Number(item.paid_amount || 0).toLocaleString()}
                    </td>

                    <td className="py-4 px-6 font-bold text-secondary">
                      ${Number(item.due_amount || 0).toLocaleString()}
                    </td>

                    <td className="py-4 px-6">
                      <StatusBadge status={item.payment_status} />
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setEditingPayment(item);
                          setNewPaid(item.paid_amount || item.total_price || 0);
                          setNewStatus(item.payment_status || 'paid');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 hover:text-primary hover:bg-primary/10 text-xs font-bold transition-all cursor-pointer"
                      >
                        <FiEdit2 size={13} /> Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <FiCreditCard className="text-primary" /> Update Payment Record
              </h2>
              <button
                onClick={() => setEditingPayment(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePayment} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                <p className="text-xs text-slate-400 font-medium">Customer: <strong className="text-slate-800">{editingPayment.user_name}</strong></p>
                <p className="text-xs text-slate-400 font-medium">Total Price: <strong className="text-slate-800">${Number(editingPayment.total_price || 0).toLocaleString()}</strong></p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Amount Paid ($)
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingPayment.total_price}
                  value={newPaid}
                  onChange={(e) => setNewPaid(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Payment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-primary"
                >
                  <option value="paid">Paid (Fully Cleared)</option>
                  <option value="due">Partial Due</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-primary transition-colors disabled:bg-slate-400"
                >
                  {updating ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || 'unpaid').toLowerCase();

  if (normalized === 'paid') {
    return (
      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
        Paid
      </span>
    );
  }
  if (normalized === 'due') {
    return (
      <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-bold uppercase tracking-wider">
        Due
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
      {normalized}
    </span>
  );
}
