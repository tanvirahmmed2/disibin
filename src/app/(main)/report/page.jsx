'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiSend, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import TiptapEditor from '@/component/helper/TiptapEditor';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.description.trim()) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/public/report', formData);
      if (res.data.success) {
        setSubmitted(true);
        toast.success('Report submitted successfully! Check your email for confirmation.');
      } else {
        toast.error(res.data.message || 'Failed to submit report');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className=" w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 mb-4 shadow-sm">
            <FiAlertTriangle size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report an Issue</h1>
          <p className="mt-2 text-slate-500 text-sm max-w-md mx-auto">
            Found a bug, security vulnerability, or technical error? Let our team know and we&apos;ll investigate immediately.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Report Received</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Thank you for helping us improve! We have sent a confirmation email to <span className="font-semibold text-slate-800">{formData.email}</span>. Our team will investigate shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', subject: '', description: '' });
              }}
              className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className=" p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-style"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-style"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Issue Title / Subject *</label>
              <input
                type="text"
                required
                placeholder="Brief summary of the issue (e.g., Checkout page broken on mobile)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input-style"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Detailed Description *</label>
              <TiptapEditor
                content={formData.description}
                onChange={(html) => setFormData({ ...formData, description: html })}
                placeholder="Describe what happened, steps to reproduce, or expected behavior..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Submitting Report...</span>
              ) : (
                <>
                  <FiSend size={18} />
                  <span>Submit Issue Report</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}