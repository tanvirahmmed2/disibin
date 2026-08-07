'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiUserCheck, FiBriefcase, FiArrowRight, FiPlus, FiUsers, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LeadsOverviewPage() {
  const [clientLeadsCount, setClientLeadsCount] = useState(0);
  const [businessLeadsCount, setBusinessLeadsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadsCounts();
  }, []);

  const fetchLeadsCounts = async () => {
    try {
      const [clientRes, businessRes] = await Promise.all([
        axios.get('/api/team/leads/clients').catch(() => ({ data: { data: [] } })),
        axios.get('/api/team/leads/business').catch(() => ({ data: { data: [] } })),
      ]);

      if (clientRes.data.success) {
        setClientLeadsCount(clientRes.data.data.length || 0);
      }
      if (businessRes.data.success) {
        setBusinessLeadsCount(businessRes.data.data.length || 0);
      }
    } catch {
      toast.error('Failed to load lead metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FiUserCheck className="text-primary" /> Leads & Sales Inquiries
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage captured customer inquiries, enterprise leads, and sales pipelines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/team/leads/clients/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
          >
            <FiPlus size={14} /> New Client Lead
          </Link>
          <Link
            href="/team/leads/business/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-xs hover:bg-primary/20 transition-all"
          >
            <FiPlus size={14} /> New Business Lead
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
            <FiUsers size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Captured Leads</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {loading ? '...' : clientLeadsCount + businessLeadsCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
            <FiUserCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Leads</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {loading ? '...' : clientLeadsCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
            <FiBriefcase size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Business / B2B Leads</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {loading ? '...' : businessLeadsCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Client Leads Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FiUserCheck size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Client Leads Directory</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Track individual customer signups, contact inquiries, notes, and custom project requests.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {clientLeadsCount} Registered Lead{clientLeadsCount === 1 ? '' : 's'}
            </span>
            <Link
              href="/team/leads/clients"
              className="inline-flex items-center gap-2 text-primary font-extrabold text-sm hover:gap-3 transition-all"
            >
              Manage Client Leads <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Business Leads Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FiBriefcase size={24} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Business & Enterprise Leads</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Manage enterprise deals, company inquiries, business partnerships, and high-value sales pipelines.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {businessLeadsCount} B2B Lead{businessLeadsCount === 1 ? '' : 's'}
            </span>
            <Link
              href="/team/leads/business"
              className="inline-flex items-center gap-2 text-primary font-extrabold text-sm hover:gap-3 transition-all"
            >
              Manage Business Leads <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
