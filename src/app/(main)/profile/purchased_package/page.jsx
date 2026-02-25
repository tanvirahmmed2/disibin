'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBox, FaCalendarAlt, FaCreditCard, FaRegCheckCircle, FaHourglassHalf, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

const PurchasedPackages = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get('/api/user/purchased_packages', { withCredentials: true });
        setPurchases(res.data.payload);
      } catch (error) {
        console.error("Error loading purchases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="h-48 w-full bg-white rounded-3xl animate-pulse border border-slate-100" />
      ))}
    </div>
  );

  if (purchases.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white/40 border border-dashed border-slate-300 rounded-3xl">
      <FaBox className="text-slate-200 text-5xl mb-4" />
      <p className="text-slate-400 font-light tracking-wide">No active or past subscriptions found.</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center gap-4 p-1 sm:p-4">
      {purchases.map((item) => (
        <div 
          key={item.purchase_id} 
          className="group w-full flex flex-row shadow bg-gray-100 rounded-xl overflow-hidden"
        >
          <div className="md:w-64 h-48 md:h-auto relative overflow-hidden bg-slate-100">
            <Image 
              src={item.package_info?.thumbnail} 
              alt={item.package_title} 
              width={1000}
              height={1000}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4">
               <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-slate-800 rounded-lg">
                {item.package_info?.category || 'Service'}
              </span>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-light text-slate-800 tracking-tight">
                  {item.package_title}
                </h3>
                <div className="flex flex-col items-end">
                  <p className="text-2xl font-light text-slate-900">৳{item.total_price}</p>
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mt-1 px-3 py-1 rounded-full ${
                    item.access_status === 'active' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {item.access_status === 'active' ? <FaRegCheckCircle /> : <FaHourglassHalf />}
                    {item.access_status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-500 font-light line-clamp-2 mb-4 max-w-xl">
                {item.package_info?.brief}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.package_info?.feature_list?.slice(0, 3).map((feature, i) => (
                  <span key={i} className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  <FaCalendarAlt className="text-sky-400" /> Subscription Period
                </p>
                <p className="text-xs text-slate-700 font-medium">
                  {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'} — {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  <FaCreditCard className="text-sky-400" /> Payment Method
                </p>
                <p className="text-xs text-slate-700 font-medium">
                  {item.billing_info?.method || 'Direct'} ({item.billing_info?.payment_status || 'System'})
                </p>
              </div>

              <div className="flex items-end justify-end">
                <button className="flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors group/btn">
                  View Invoice <FaExternalLinkAlt className="text-[10px] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchasedPackages;