'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiMail, FiUser, FiCalendar, FiClock,
  FiSend, FiTrash2, FiCheckCircle, FiAlertCircle, FiLoader
} from 'react-icons/fi';
import TiptapEditor from '@/component/helper/TiptapEditor';

export default function SupportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.slug;

  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (requestId) fetchSupportDetail();
  }, [requestId]);

  const fetchSupportDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/support');
      if (res.data.success) {
        const item = res.data.data.find(s => s.id.toString() === requestId.toString());
        if (item) {
          setSupport(item);
          setReplyText(item.reply || '');
        } else {
          toast.error('Support request not found');
        }
      }
    } catch {
      toast.error('Failed to load support request details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText || !replyText.replace(/<[^>]+>/g, '').trim()) {
      return toast.error('Reply cannot be empty');
    }

    setReplyLoading(true);
    try {
      const res = await axios.patch('/api/team/support', {
        id: support.id,
        reply: replyText
      });

      if (res.data.success) {
        toast.success('Reply saved and email sent to submitter');
        setSupport(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to send reply');
      }
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this support request? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await axios.delete(`/api/team/support?id=${support.id}`);
      if (res.data.success) {
        toast.success('Support request deleted');
        router.push('/team/support');
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete support request');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 p-6 text-slate-400">
        <FiLoader className="animate-spin text-sky-500" size={28} />
        <p className="text-sm font-medium">Loading support request...</p>
      </div>
    );
  }

  if (!support) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4 text-center">
        <Toaster position="top-center" />
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <FiAlertCircle className="mx-auto text-amber-500" size={36} />
          <h2 className="text-lg font-bold text-slate-800">Support Request Not Found</h2>
          <Link
            href="/team/support"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-sky-600 transition-all shadow-md"
          >
            <FiArrowLeft size={14} /> Back to Support Inbox
          </Link>
        </div>
      </div>
    );
  }

  const isPending = support.status === 'pending';

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/team/support"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Support Inbox
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-100 transition-all disabled:opacity-50"
        >
          {deleting ? <FiLoader className="animate-spin" size={13} /> : <FiTrash2 size={13} />}
          Delete Request
        </button>
      </div>

      {/* Header Info Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPending ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {isPending ? <FiClock size={11} /> : <FiCheckCircle size={11} />}
                {isPending ? 'Pending Reply' : 'Replied'}
              </span>
              <span className="text-xs font-mono text-slate-400">#{support.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{support.subject || 'No Subject'}</h1>
          </div>
        </div>

        {/* Sender details row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FiUser className="text-sky-500 shrink-0" size={14} />
            <div>
              <p className="text-slate-400 font-medium">Submitter</p>
              <p className="font-bold">{support.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <FiMail className="text-sky-500 shrink-0" size={14} />
            <div>
              <p className="text-slate-400 font-medium">Email Address</p>
              <a href={`mailto:${support.email}`} className="font-bold hover:underline">{support.email}</a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <FiCalendar className="text-sky-500 shrink-0" size={14} />
            <div>
              <p className="text-slate-400 font-medium">Submitted On</p>
              <p className="font-bold">{new Date(support.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Body */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Inquiry</h3>
        <div
          className="text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: support.description }}
        />
      </div>

      {/* Saved Reply Callout (if available) */}
      {support.reply && (
        <div className="bg-emerald-50/60 p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <FiCheckCircle size={13} /> Saved Reply Sent to Submitter
            </span>
            {support.responder_name && (
              <span className="font-normal text-emerald-600">By: {support.responder_name}</span>
            )}
          </div>
          <div
            className="text-slate-800 text-sm leading-relaxed prose prose-emerald max-w-none"
            dangerouslySetInnerHTML={{ __html: support.reply }}
          />
        </div>
      )}

      {/* Reply Composer — Only show if pending (not replied yet) */}
      {isPending ? (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Compose Email Reply
          </h3>

          <TiptapEditor
            value={replyText}
            onChange={setReplyText}
            placeholder={`Write your reply to ${support.email}...`}
          />

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              Sending will dispatch an email directly to <strong>{support.email}</strong>.
            </p>
            <button
              onClick={handleSendReply}
              disabled={replyLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 shadow-md shrink-0"
            >
              {replyLoading ? <FiLoader className="animate-spin" size={14} /> : <FiSend size={14} />}
              {replyLoading ? 'Sending...' : 'Send Email Reply'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-100 rounded-2xl text-center text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
          <FiCheckCircle className="text-emerald-500" size={14} />
          This support request has already been replied to.
        </div>
      )}
    </div>
  );
}
