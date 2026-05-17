'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiGift, FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get('/api/coupon');
        if (res.data.success) {
          setCoupons(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch coupons', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-600">
            Exclusive Offers
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Unlock premium value with our active promotional codes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupons.map((coupon) => (
            <div key={coupon.coupon_id} className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 group flex flex-col p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <FiGift size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {coupon.is_percentage ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
                  </h2>
                  {coupon.product_name && (
                    <p className="text-xs text-slate-500">For {coupon.product_name}</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between mb-4">
                <code className="text-lg font-bold text-slate-800">{coupon.code}</code>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`p-2 rounded-lg transition-colors ${copiedCode === coupon.code ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-500 border border-slate-100'}`}
                >
                  {copiedCode === coupon.code ? <FiCheck size={16} /> : <FiCopy size={16} />}
                </button>
              </div>

              <div className="text-sm text-slate-600 space-y-1 flex-grow">
                {coupon.max_discount && (
                  <p>Max Discount: <span className="font-bold">${coupon.max_discount}</span></p>
                )}
                {coupon.usage_limit > 0 && (
                  <p>Limited Uses! <span className="text-rose-500 font-bold">{coupon.usage_limit - coupon.used_count} left</span></p>
                )}
                {coupon.end_date && (
                  <p>Expires: <span className="font-bold">{new Date(coupon.end_date).toLocaleDateString()}</span></p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
                Terms and conditions apply. Valid while supplies last.
              </div>
            </div>
          ))}
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <FiGift className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-medium">No active coupons at this moment. Stay tuned.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsPage;
