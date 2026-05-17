'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  FiActivity, FiPieChart, FiBriefcase, FiCreditCard,
  FiShoppingCart, FiUsers, FiArrowRight
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/api/analytics');
      if (res.data.success) setData(res.data.data);
    } catch {
      // Silently fail or handle
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Analytics', href: '/dashboard/admin/analytics', icon: <FiPieChart />, desc: 'View stats and charts', count: null },
    { title: 'People', href: '/dashboard/admin/people', icon: <FiUsers />, desc: 'Manage users and roles', count: data?.totalUsers },
    { title: 'Career', href: '/dashboard/admin/career', icon: <FiBriefcase />, desc: 'Manage job listings', count: null },
    { title: 'Purchases', href: '/dashboard/admin/purchases', icon: <FiShoppingCart />, desc: 'Manage orders', count: data?.pendingPurchases },
    { title: 'Payments', href: '/dashboard/admin/payments', icon: <FiCreditCard />, desc: 'Monitor transactions', count: null },
    { title: 'Activity', href: '/dashboard/admin/activity', icon: <FiActivity />, desc: 'Audit logs', count: null },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here is a summary of the platform.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link href={card.href} key={card.title} className="block group">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full hover:border-violet-200">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 text-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  {card.icon}
                </div>
                {card.count !== undefined && card.count !== null && (
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    {card.count}
                  </span>
                )}
              </div>
              
              <div className="mt-5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {card.title}
                  <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-violet-600" size={16} />
                </h2>
                <p className="text-sm text-slate-400 mt-1">{card.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
