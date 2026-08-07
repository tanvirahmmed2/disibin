'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiSend, FiUsers, FiUserCheck, FiBriefcase, FiUser,
  FiMail, FiEye, FiEdit3, FiLoader, FiRefreshCw, FiCheckCircle, FiSendHeader
} from 'react-icons/fi';
import TiptapEditor from '@/component/helper/TiptapEditor';

export default function NewsLetterPage() {
  const [metrics, setMetrics] = useState({ clientLeadsCount: 0, businessLeadsCount: 0, registeredUsersCount: 0, totalAudience: 0 });
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [targetGroup, setTargetGroup] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [activeTab, setActiveTab] = useState('compose'); // 'compose' | 'preview'
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await axios.get('/api/team/newsletter');
      if (res.data.success) {
        setMetrics(res.data.data);
      }
    } catch {
      toast.error('Failed to load lead metrics');
    } finally {
      setLoadingMetrics(false);
    }
  };

  const getRecipientCount = () => {
    if (targetGroup === 'clients') return metrics.clientLeadsCount;
    if (targetGroup === 'business') return metrics.businessLeadsCount;
    if (targetGroup === 'users') return metrics.registeredUsersCount;
    return metrics.totalAudience;
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return toast.error('Please enter an email subject line');
    if (!message.trim() || message === '<p></p>') return toast.error('Please write your newsletter message content');

    const count = getRecipientCount();
    if (count === 0) return toast.error('Selected target group has 0 recipients');

    if (!window.confirm(`Are you sure you want to send this email newsletter to ${count} recipient(s)?`)) return;

    setSending(true);
    try {
      const res = await axios.post('/api/team/newsletter', {
        targetGroup,
        subject: subject.trim(),
        message: message.trim()
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setSubject('');
        setMessage('');
        setActiveTab('compose');
      } else {
        toast.error(res.data.message || 'Failed to send campaign');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email campaign');
    } finally {
      setSending(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) return toast.error('Please enter a test email address');
    if (!subject.trim()) return toast.error('Please enter an email subject line');
    if (!message.trim() || message === '<p></p>') return toast.error('Please write your newsletter message content');

    setSendingTest(true);
    try {
      const res = await axios.post('/api/team/newsletter', {
        testEmail: testEmail.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || 'Test email failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send test email');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FiMail size={20} />
            </span>
            Email Newsletters & Campaigns
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Dispatch marketing and transactional email campaigns to Leads & Registered Users via Brevo Mailer
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={loadingMetrics}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs self-start sm:self-auto shadow-sm cursor-pointer"
        >
          <FiRefreshCw className={loadingMetrics ? 'animate-spin' : ''} size={15} />
          Refresh Leads Count
        </button>
      </div>

      {/* Audience Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setTargetGroup('all')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm flex items-center gap-4 ${
            targetGroup === 'all'
              ? 'bg-primary/10 border-primary-light ring-2 ring-primary/20'
              : 'bg-white border-slate-100 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <FiUsers size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">All Audience</p>
            <p className="text-2xl font-bold text-slate-900">
              {loadingMetrics ? '...' : metrics.totalAudience}
            </p>
          </div>
        </div>

        <div
          onClick={() => setTargetGroup('clients')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm flex items-center gap-4 ${
            targetGroup === 'clients'
              ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20'
              : 'bg-white border-slate-100 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <FiUserCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Leads</p>
            <p className="text-2xl font-bold text-slate-900">
              {loadingMetrics ? '...' : metrics.clientLeadsCount}
            </p>
          </div>
        </div>

        <div
          onClick={() => setTargetGroup('business')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm flex items-center gap-4 ${
            targetGroup === 'business'
              ? 'bg-secondary/10 border-secondary/30 ring-2 ring-secondary/20'
              : 'bg-white border-slate-100 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
            <FiBriefcase size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Business Leads</p>
            <p className="text-2xl font-bold text-slate-900">
              {loadingMetrics ? '...' : metrics.businessLeadsCount}
            </p>
          </div>
        </div>

        <div
          onClick={() => setTargetGroup('users')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm flex items-center gap-4 ${
            targetGroup === 'users'
              ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20'
              : 'bg-white border-slate-100 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <FiUser size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Users</p>
            <p className="text-2xl font-bold text-slate-900">
              {loadingMetrics ? '...' : metrics.registeredUsersCount}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form & Editor Workspace */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Workspace Bar / Tabs */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'compose' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiEdit3 size={13} /> Compose Email
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiEye size={13} /> Live Preview
            </button>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            Targeting: <span className="text-primary capitalize font-extrabold">{targetGroup}</span> ({getRecipientCount()} Recipient{getRecipientCount() !== 1 ? 's' : ''})
          </div>
        </div>

        {/* Tab 1: Compose Email */}
        {activeTab === 'compose' ? (
          <form onSubmit={handleSendCampaign} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="E.g. Exciting New Product Updates & Offerings from Disibin"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Body Message *
              </label>
              <TiptapEditor
                value={message}
                onChange={setMessage}
                placeholder="Write your email newsletter content here..."
              />
            </div>

            {/* Test Email Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Send Test Email First
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  placeholder="Enter your email to receive a test preview..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={sendingTest || !testEmail}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary/30 rounded-xl font-bold text-xs transition-all disabled:opacity-50 shadow-sm cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-end"
              >
                {sendingTest ? <FiLoader className="animate-spin" size={14} /> : <FiSend size={14} />}
                Send Test Email
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Brevo Mailer will send this email campaign to <strong>{getRecipientCount()} recipient(s)</strong>.
              </p>
              <button
                type="submit"
                disabled={sending || getRecipientCount() === 0}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-md shadow-primary/20 shrink-0 cursor-pointer"
              >
                {sending ? <FiLoader className="animate-spin" size={16} /> : <FiSend size={16} />}
                {sending ? 'Dispatching Newsletter...' : `Dispatch to ${getRecipientCount()} Recipient(s)`}
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Live HTML Email Preview */
          <div className="p-6 space-y-4 bg-slate-50/40 min-h-[400px]">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Subject Line</p>
                <h2 className="text-xl font-bold text-slate-900">{subject || 'No subject line specified'}</h2>
                <p className="text-xs text-slate-500 pt-1">
                  From: Disibin Newsletter &lt;no-reply@disibin.com&gt;
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-sm text-slate-600 font-medium">Hi [Recipient Name],</p>
                <div
                  className="text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: message || '<p class="text-slate-400 italic">No message content entered yet...</p>' }}
                />
              </div>

              <div className="pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  Disibin Official Newsletter · You received this email as a registered member or lead.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
