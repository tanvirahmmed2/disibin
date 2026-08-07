'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiSend, FiPaperclip,
  FiCreditCard, FiFileText, FiLoader, FiExternalLink, FiAlertCircle
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
      toast.error('Failed to load project');
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
      <div className="py-16 flex flex-col items-center justify-center space-y-2 text-slate-400">
        <FiLoader className="animate-spin text-primary" size={24} />
        <p className="text-xs">Loading project...</p>
      </div>
    );
  }

  if (!projectData || !projectData.project) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-3">
        <Toaster position="top-center" />
        <FiAlertCircle className="mx-auto text-amber-500" size={32} />
        <h2 className="text-base font-bold text-slate-800">Project Not Found</h2>
        <Link
          href="/user/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
        >
          <FiArrowLeft size={14} /> Back to My Projects
        </Link>
      </div>
    );
  }

  const { project, messages, attachments, purchases, agreements } = projectData;

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <Toaster position="top-center" />

      {/* Clean Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/user/projects"
            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
            title="Back to Projects"
          >
            <FiArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900">{project.title}</h1>
            <p className="text-xs text-slate-400">
              {project.product_name ? `Base: ${project.product_name} · ` : ''}Created {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 bg-slate-50 uppercase text-slate-700">
          {project.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Messages */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[460px]">
            <div className="p-3 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-700">
              Discussion Thread
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No discussion messages yet. Type your first message below.
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = !!m.user_id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[11px] font-semibold text-slate-500 mb-0.5 px-1">
                        {isMe ? 'You' : `${m.team_name || 'Staff'} (${m.team_role || 'Support'})`}
                      </div>
                      <div className={`p-3 rounded-xl text-xs leading-relaxed max-w-md ${
                        isMe ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        <p className="whitespace-pre-wrap">{m.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={e => setAttachmentFile(e.target.files[0])}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 border border-slate-200 hover:bg-white text-slate-500 rounded-lg text-xs"
                title="Attach File"
              >
                <FiPaperclip size={15} />
              </button>

              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary"
              />

              <button
                type="submit"
                disabled={sending || (!message.trim() && !attachmentFile)}
                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {sending ? <FiLoader className="animate-spin" size={13} /> : <FiSend size={13} />}
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-3 text-xs">
          {/* Billing */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FiCreditCard size={14} className="text-slate-500" /> Billing Details
            </h3>

            {purchases.length === 0 ? (
              <p className="text-slate-400">No invoice issued yet.</p>
            ) : (
              purchases.map(pur => (
                <div key={pur.purchase_id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Price</span>
                    <span>${pur.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Status</span>
                    <span className="font-semibold uppercase">{pur.payment_status || 'unpaid'}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Agreements */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FiFileText size={14} className="text-slate-500" /> Agreements
            </h3>

            {agreements.length === 0 ? (
              <p className="text-slate-400">No agreement attached.</p>
            ) : (
              agreements.map(agr => (
                <div key={agr.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 truncate">{agr.title}</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border border-slate-200">
                      {agr.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={agr.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <FiExternalLink size={11} /> Document
                    </a>

                    {agr.status === 'pending' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSignAgreement(agr.id, 'signed')}
                          disabled={updatingAgreementId === agr.id}
                          className="px-2 py-0.5 bg-emerald-600 text-white rounded font-semibold text-[11px]"
                        >
                          Sign
                        </button>
                        <button
                          onClick={() => handleSignAgreement(agr.id, 'rejected')}
                          disabled={updatingAgreementId === agr.id}
                          className="px-2 py-0.5 bg-rose-600 text-white rounded font-semibold text-[11px]"
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
