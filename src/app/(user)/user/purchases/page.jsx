'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserPurchasesPage = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">My Purchases</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.purchase_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.product_name}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ${p.final_amount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.payment_provider?.toUpperCase()}</div>
                    <div className="text-xs text-slate-400">Txn: {p.transaction_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.status === 'approved' || p.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      p.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      p.status === 'rejected' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                    You haven't made any purchases yet.
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

export default UserPurchasesPage;
