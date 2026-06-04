'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiPieChart, FiUsers, FiBriefcase, FiActivity, FiLifeBuoy
} from 'react-icons/fi';

const AnalyticsPage = () => {
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
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: data?.totalUsers || 0, icon: <FiUsers />, color: 'bg-blue-500' },
    { label: 'Active Projects', value: data?.activeProjects || 0, icon: <FiBriefcase />, color: 'bg-emerald-500' },
    { label: 'Pending Tasks', value: data?.pendingTasks || 0, icon: <FiActivity />, color: 'bg-amber-500' },
    { label: 'Open Tickets', value: data?.openTickets || 0, icon: <FiLifeBuoy />, color: 'bg-rose-500' },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
            <FiPieChart className="text-violet-600" size={18} />
          </span>
          Analytics Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">Platform performance and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AnalyticsPage;
