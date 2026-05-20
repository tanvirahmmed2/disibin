'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

const ManagerPurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/purchases');
      if (res.data.success) {
        setPurchases(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch purchases', error);
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleAction = async (purchaseId, status) => {
    let reason = '';
    if (status === 'rejected') {
        reason = prompt("Please enter a reason for rejection:");
        if (reason === null) return; // Cancelled
    }

    try {
      const res = await axios.patch('/api/purchases', { purchaseId, status, reason });
      if (res.data.success) {
        toast.success(`Order ${status} successfully`);
        fetchPurchases(); // Refresh
      } else {
        toast.error(res.data.message || "Action failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (purchaseId) => {
    if (!confirm("Are you sure you want to delete this purchase record?")) return;
    try {
      const res = await axios.delete(`/api/purchases?id=${purchaseId}`);
      if (res.data.success) {
        toast.success("Purchase deleted successfully");
        fetchPurchases(); // Refresh
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Purchase Requests</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.purchase_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.user_name}</div>
                    <div className="text-xs text-slate-400">{p.user_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.product_name}</div>
                    <div className="text-xs text-slate-400">Orig: ${p.original_amount} | Disc: ${p.discount_amount}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ${p.final_amount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.payment_provider?.toUpperCase()} ({p.payment_method})</div>
                    <div className="text-xs text-slate-400">Txn: {p.transaction_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                      p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      p.status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {p.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(p.purchase_id, 'approved')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(p.purchase_id, 'rejected')}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(p.purchase_id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    No purchase requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerPurchasesPage;
