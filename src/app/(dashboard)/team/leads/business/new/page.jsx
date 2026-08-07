'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiBriefcase, FiArrowLeft, FiPlus, FiLoader } from 'react-icons/fi';

export default function NewBusinessLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      return toast.error('Business name and email are required');
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/team/leads/business', form);
      if (res.data.success) {
        toast.success('Business lead created successfully!');
        router.push('/team/leads/business');
      } else {
        toast.error(res.data.message || 'Failed to create business lead');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full space-y-6">
      <Toaster position="top-center" />

      <div className="space-y-4">
        <Link
          href="/team/leads/business"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-secondary transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Business Leads
        </Link>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <FiBriefcase size={20} />
              </span>
              Add New Business Lead
            </h1>
            <p className="text-slate-500 text-sm pl-11">
              Manually record a corporate lead or business partner contact
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business / Company Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Nexus Software Solutions Inc."
            className="input-style font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="contact@company.com"
              className="input-style font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 (555) 987-6543"
              className="input-style font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Office Address</label>
          <input
            type="text"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. 500 Silicon Valley Blvd, CA"
            className="input-style"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Notes & Opportunity Details</label>
          <textarea
            rows={4}
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            placeholder="Write details regarding partnership interest, project budget, custom software scope..."
            className="input-style resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/team/leads/business"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold transition-all text-sm disabled:opacity-50 flex items-center gap-2 shadow-md"
          >
            {loading ? <FiLoader className="animate-spin" size={16} /> : <FiPlus size={16} />}
            {loading ? 'Creating...' : 'Create Business Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
