'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiFolder, FiSend, FiPaperclip,
  FiCheckCircle, FiClock, FiCreditCard, FiFileText,
  FiLoader, FiExternalLink, FiDollarSign, FiAlertCircle, FiMessageSquare
} from 'react-icons/fi';

export default function UserProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [updatingAgreementId, setUpdatingAgreementId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (projectId) fetchProjectWorkspace();
  }, [projectId]);

  const fetchProjectWorkspace = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/project/${projectId}`);
      if (res.data.success) {
        setProjectData(res.data.data);
      } else {
        toast.error(res.data.message || 'Project not found');
      }
    } catch {
      toast.error('Failed to load project workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !attachmentFile) return;

    setSending(true);
    const formData = new FormData();
    if (message.trim()) formData.append('message', message.trim());
    if (attachmentFile) formData.append('file', attachmentFile);

    try {
      const res = await axios.post(`/api/user/project/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessage('');
        setAttachmentFile(null);
        fetchProjectWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to send message');
      }
    } catch {
      toast.error('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const handleSignAgreement = async (agreementId, newStatus) => {
    setUpdatingAgreementId(agreementId);
    try {
      const res = await axios.patch('/api/user/agreements', {
        agreement_id: agreementId,
        status: newStatus
      });
      if (res.data.success) {
        toast.success(`Agreement marked as ${newStatus}`);
        fetchProjectWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to update agreement');
      }
    } catch {
      toast.error('Failed to update agreement status');
    } finally {
      setUpdatingAgreementId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3 p-6 text-slate-400">
        <FiLoader className="animate-spin text-sky-500" size={28} />
        <p className="text-sm font-medium">Loading project workspace...</p>
      </div>
    );
  }

  if (!projectData || !projectData.project) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4 text-center">
        <Toaster position="top-center" />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <FiAlertCircle className="mx-auto text-amber-500" size={36} />
          <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
          <p className="text-xs text-slate-500">The requested project workspace could not be located.</p>
          <Link
            href="/user/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-sky-600 transition-all shadow-md"
          >
            <FiArrowLeft size={14} /> Back to My Projects
          </Link>
        </div>
      </div>
    );
  }

  const { project, messages, attachments, purchases, agreements } = projectData;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/user/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <FiArrowLeft size={16} /> Back to My Projects
          </Link>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            project.status === 'approved' || project.status === 'ready'
              ? 'bg-emerald-100 text-emerald-700'
              : project.status === 'working' || project.status === 'ontest' || project.status === 'fixing'
              ? 'bg-sky-100 text-sky-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            Status: {project.status}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">{project.title}</h1>
          <p className="text-xs text-slate-500">
            {project.product_name ? `Linked Product: ${project.product_name}` : 'Custom Project Workspace'}
            <span> · Created {new Date(project.created_at).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Conversation Thread (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col min-h-[480px]">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiMessageSquare className="text-sky-500" size={18} />
              Project Discussion & Inquiries
            </h2>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[420px]">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No discussion messages sent yet. Send your first inquiry below!
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = !!m.user_id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-4 rounded-2xl max-w-lg space-y-1 text-xs shadow-sm ${
                        isMe
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 border-b border-white/20 pb-1 mb-1">
                          <span className="font-bold">{isMe ? 'You' : `${m.team_name || 'Staff'} (${m.team_role || 'Support'})`}</span>
                          <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type message or question..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => setAttachmentFile(e.target.files[0])}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2.5 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1 ${
                    attachmentFile
                      ? 'bg-sky-50 border-sky-300 text-sky-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Attach file"
                >
                  <FiPaperclip size={16} />
                </button>
                <button
                  type="submit"
                  disabled={sending || (!message.trim() && !attachmentFile)}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50 shadow-md flex items-center gap-1.5 shrink-0"
                >
                  {sending ? <FiLoader className="animate-spin" size={14} /> : <FiSend size={14} />}
                  Send
                </button>
              </div>

              {attachmentFile && (
                <p className="text-[11px] text-sky-600 font-semibold truncate pl-1">
                  Attached file: {attachmentFile.name}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Sidebar Column: Purchases, Payments & Agreements (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Purchase & Payment Details Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FiCreditCard className="text-emerald-500" size={16} />
              Billing & Purchase Status
            </h3>

            {purchases.length === 0 ? (
              <p className="text-xs text-slate-400">No invoice or purchase generated yet. Discussion in progress.</p>
            ) : (
              purchases.map(pur => (
                <div key={pur.purchase_id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Proposal Price</span>
                    <span className="font-extrabold text-slate-900">${pur.price}</span>
                  </div>
                  {pur.discount > 0 && (
                    <div className="flex items-center justify-between text-rose-600 font-semibold">
                      <span>Discount ({pur.discount}%)</span>
                      <span>-${Math.round(pur.price * (pur.discount / 100))}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800">Payment Status</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      pur.payment_status === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : pur.payment_status === 'due'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {pur.payment_status || 'unpaid'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Agreements Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FiFileText className="text-sky-500" size={16} />
              Project Agreements
            </h3>

            {agreements.length === 0 ? (
              <p className="text-xs text-slate-400">No project agreement document assigned yet.</p>
            ) : (
              agreements.map(agr => (
                <div key={agr.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 truncate">{agr.title}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase shrink-0 ${
                      agr.status === 'signed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : agr.status === 'rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {agr.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                    <a
                      href={agr.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <FiExternalLink size={12} /> View Document
                    </a>

                    {agr.status === 'pending' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSignAgreement(agr.id, 'signed')}
                          disabled={updatingAgreementId === agr.id}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all text-[11px]"
                        >
                          Sign
                        </button>
                        <button
                          onClick={() => handleSignAgreement(agr.id, 'rejected')}
                          disabled={updatingAgreementId === agr.id}
                          className="px-2.5 py-1 bg-rose-100 text-rose-700 font-bold rounded-lg hover:bg-rose-200 transition-all text-[11px]"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
