'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiArrowLeft, FiPlus, FiLoader } from 'react-icons/fi';

export default function NewClientLeadPage() {
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
      return toast.error('Client name and email are required');
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/team/leads/clients', form);
      if (res.data.success) {
        toast.success('Client lead created successfully!');
        router.push('/team/leads/clients');
      } else {
        toast.error(res.data.message || 'Failed to create client lead');
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

      {/* Back button & Header */}
      <div className="space-y-4">
        <Link
          href="/team/leads/clients"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Client Leads
        </Link>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FiUsers size={20} />
              </span>
              Add New Client Lead
            </h1>
            <p className="text-slate-500 text-sm pl-11">
              Manually register a prospective client or organization lead
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client / Business Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Acme Corporation / Sarah Connor"
            className="input-style font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="client@company.com"
              className="input-style font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 (555) 234-5678"
              className="input-style font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address / Location</label>
          <input
            type="text"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. 100 Main St, San Francisco, CA"
            className="input-style"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes & Special Requirements</label>
          <textarea
            rows={4}
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            placeholder="Write any relevant lead notes, custom project requirements, or outreach history..."
            className="input-style resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/team/leads/clients"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-primary text-white font-bold transition-all text-sm disabled:opacity-50 flex items-center gap-2 shadow-md"
          >
            {loading ? <FiLoader className="animate-spin" size={16} /> : <FiPlus size={16} />}
            {loading ? 'Creating...' : 'Create Client Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
