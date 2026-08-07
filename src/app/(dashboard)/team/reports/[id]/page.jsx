'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiSend,
  FiUser,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2
} from 'react-icons/fi';
import TiptapEditor from '@/component/helper/TiptapEditor';

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/reports');
      if (res.data.success) {
        const found = res.data.data.find((r) => String(r.id) === String(id));
        if (found) {
          setReport(found);
          if (found.reply) setReplyText(found.reply);
        } else {
          toast.error('Report not found');
          router.push('/team/reports');
        }
      }
    } catch {
      toast.error('Failed to load report detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return toast.error('Please write a reply message');

    setSending(true);
    try {
      const res = await axios.patch('/api/team/reports', {
        id: report.id,
        reply: replyText
      });
      if (res.data.success) {
        toast.success('Reply email sent successfully');
        setReport(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to send reply');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply email');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue report?')) return;
    try {
      const res = await axios.delete(`/api/team/reports?id=${report.id}`);
      if (res.data.success) {
        toast.success('Report deleted');
        router.push('/team/reports');
      }
    } catch {
      toast.error('Failed to delete report');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading report details...
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back button & header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.push('/team/reports')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          <FiArrowLeft size={16} />
          <span>Back to Reports</span>
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all"
        >
          <FiTrash2 size={16} />
          <span>Delete Report</span>
        </button>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                Report #{report.id}
              </span>
              {report.status === 'replied' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <FiCheckCircle size={12} />
                  Replied
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">
                  <FiClock size={12} />
                  Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{report.subject}</h1>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <div>Submitted: {new Date(report.created_at).toLocaleString()}</div>
            {report.responder_name && (
              <div className="text-primary font-medium">Responded by: {report.responder_name}</div>
            )}
          </div>
        </div>

        {/* Submitter Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm">
          <div className="flex items-center gap-3">
            <FiUser className="text-slate-400" size={18} />
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">Submitter Name</span>
              <span className="font-semibold text-slate-800">{report.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="text-slate-400" size={18} />
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">Email Address</span>
              <span className="font-semibold text-slate-800">{report.email}</span>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Description</h3>
          <div
            className="prose prose-slate max-w-none p-5 bg-slate-50/50 rounded-2xl border border-slate-100 text-slate-800 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: report.description }}
          />
        </div>
      </div>

      {/* Reply Composer Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <FiSend size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Send Email Reply</h2>
            <p className="text-xs text-slate-500">Your response will be emailed directly to {report.email}</p>
          </div>
        </div>

        <form onSubmit={handleSendReply} className="space-y-4">
          <TiptapEditor
            content={replyText}
            onChange={(html) => setReplyText(html)}
            placeholder="Type your response to the user..."
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
            >
              {sending ? (
                <span>Sending Email...</span>
              ) : (
                <>
                  <FiSend size={16} />
                  <span>Send Response Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
