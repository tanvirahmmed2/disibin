'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiCreditCard, FiCheckCircle, FiClock, FiAlertCircle, FiSearch, FiFileText, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/user/purchases');
      if (res.data.success) {
        setPurchases(res.data.data);
      }
    } catch {
      toast.error('Failed to load purchases data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = purchases.filter((item) => {
    const titleMatch = (item.product_title || item.project_title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const status = (item.payment_status || item.purchase_status || '').toLowerCase();
    
    if (filterStatus === 'paid') return titleMatch && status === 'paid';
    if (filterStatus === 'due') return titleMatch && (status === 'due' || status === 'unpaid');
    if (filterStatus === 'complete') return titleMatch && (status === 'complete' || item.purchase_status === 'complete');
    return titleMatch;
  });

  // Calculate Metrics
  const totalSpent = purchases.reduce((sum, item) => sum + Number(item.paid || item.price || 0), 0);
  const totalDue = purchases.reduce((sum, item) => sum + Number(item.due || 0), 0);
  const completedCount = purchases.filter((item) => item.purchase_status === 'complete' || item.payment_status === 'paid').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FiShoppingBag className="text-primary" /> My Purchases & Billing
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            View your software licenses, service purchases, and payment receipts
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
        >
          Browse Products
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
            <FiCreditCard size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Invested</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">${totalSpent.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Orders</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{completedCount} Item{completedCount === 1 ? '' : 's'}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600">
            <FiAlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Balance</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">${totalDue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'paid', 'due', 'complete'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === tab
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3"></div>
          <p className="text-slate-500 text-sm font-medium">Loading your purchases...</p>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <FiShoppingBag size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Purchases Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
              You have not placed any orders or acquired custom solutions yet.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-primary transition-all"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPurchases.map((item) => (
            <div
              key={item.purchase_id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Order #{item.purchase_id}
                  </span>
                  <StatusBadge status={item.payment_status || item.purchase_status} />
                </div>

                <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                  {item.product_title || item.project_title || 'Custom System Order'}
                </h3>
                
                {item.project_title && item.product_title && (
                  <p className="text-slate-500 text-xs mt-1">Project: {item.project_title}</p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Price</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      ${Number(item.price || 0).toLocaleString()}
                    </span>
                  </div>

                  {item.due > 0 && (
                    <div className="text-right">
                      <span className="text-xs text-amber-500 block font-bold">Due Amount</span>
                      <span className="text-sm font-extrabold text-amber-600">
                        ${Number(item.due).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <FiClock size={12} /> {new Date(item.created_at).toLocaleDateString()}
                </span>

                <button
                  onClick={() => setSelectedReceipt(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors cursor-pointer"
                >
                  <FiFileText size={13} /> Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <FiFileText className="text-primary" /> Order Receipt
              </h2>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Receipt No:</span>
                <span className="font-mono font-bold text-slate-800">#REC-{selectedReceipt.purchase_id}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Date:</span>
                <span className="font-bold text-slate-800">{new Date(selectedReceipt.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Status:</span>
                <StatusBadge status={selectedReceipt.payment_status || selectedReceipt.purchase_status} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Item / Service:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.product_title || 'Custom System Solution'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Total Price:</span>
                <span className="font-bold text-slate-900">${Number(selectedReceipt.price || 0).toLocaleString()}</span>
              </div>
              {selectedReceipt.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span className="font-medium">Discount Applied:</span>
                  <span className="font-bold">-${Number(selectedReceipt.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Paid Amount:</span>
                <span className="font-bold text-emerald-600">${Number(selectedReceipt.paid || selectedReceipt.price || 0).toLocaleString()}</span>
              </div>
              {selectedReceipt.due > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Remaining Due:</span>
                  <span className="font-bold text-amber-600">${Number(selectedReceipt.due).toLocaleString()}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-primary transition-colors cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || 'complete').toLowerCase();

  if (normalized === 'paid' || normalized === 'complete') {
    return (
      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
        Paid
      </span>
    );
  }
  if (normalized === 'due') {
    return (
      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-wider">
        Partial Due
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
      {normalized}
    </span>
  );
}
