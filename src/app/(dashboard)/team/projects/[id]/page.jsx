'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiFolder, FiSend, FiPaperclip,
  FiCheckCircle, FiClock, FiCreditCard, FiFileText,
  FiLoader, FiExternalLink, FiDollarSign, FiPlus, FiAlertCircle, FiTag, FiMessageSquare
} from 'react-icons/fi';

export default function TeamProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;

  const [projectData, setProjectData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat message & file state
  const [message, setMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Manual Purchase Form State
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purProductId, setPurProductId] = useState('');
  const [purPrice, setPurPrice] = useState('');
  const [purDiscount, setPurDiscount] = useState('0');
  const [creatingPurchase, setCreatingPurchase] = useState(false);

  // Payment Completion State
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);

  // Agreement Form State
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [agrTitle, setAgrTitle] = useState('');
  const [agrFile, setAgrFile] = useState(null);
  const [creatingAgreement, setCreatingAgreement] = useState(false);

  const fileInputRef = useRef(null);
  const agrFileInputRef = useRef(null);

  useEffect(() => {
    if (projectId) fetchWorkspace();
    fetchProducts();
  }, [projectId]);

  const fetchWorkspace = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/team/projects/${projectId}`);
      if (res.data.success) {
        setProjectData(res.data.data);
      } else {
        toast.error(res.data.message || 'Project workspace not found');
      }
    } catch {
      toast.error('Failed to load project workspace');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/public/product');
      if (res.data.success) setProducts(res.data.data);
    } catch {}
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await axios.patch(`/api/team/projects/${projectId}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Project status updated to ${newStatus}`);
        setProjectData(prev => ({
          ...prev,
          project: { ...prev.project, status: newStatus }
        }));
      } else {
        toast.error(res.data.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update project status');
    } finally {
      setUpdatingStatus(false);
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
      const res = await axios.post(`/api/team/projects/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setMessage('');
        setAttachmentFile(null);
        fetchWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to send message');
      }
    } catch {
      toast.error('Error sending staff message');
    } finally {
      setSending(false);
    }
  };

  const handleCreatePurchase = async (e) => {
    e.preventDefault();
    if (!purPrice) return toast.error('Purchase price is required');

    setCreatingPurchase(true);
    try {
      const res = await axios.post('/api/team/projects/purchase', {
        project_id: projectId,
        product_id: purProductId || projectData?.project?.product_id || null,
        price: purPrice,
        discount: purDiscount
      });

      if (res.data.success) {
        toast.success('Manual purchase and payment record generated!');
        setShowPurchaseForm(false);
        setPurPrice('');
        fetchWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to create purchase');
      }
    } catch {
      toast.error('Failed to generate manual purchase');
    } finally {
      setCreatingPurchase(false);
    }
  };

  const handleUpdatePaymentStatus = async (paymentId, status, paidAmount) => {
    setUpdatingPaymentId(paymentId);
    try {
      const res = await axios.patch('/api/team/projects/payment', {
        payment_id: paymentId,
        status,
        paid: paidAmount
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to update payment');
      }
    } catch {
      toast.error('Error updating payment status');
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const handleCreateAgreement = async (e) => {
    e.preventDefault();
    if (!agrTitle.trim()) return toast.error('Agreement title is required');
    if (!agrFile) return toast.error('Please attach agreement document PDF');

    setCreatingAgreement(true);
    const formData = new FormData();
    formData.append('title', agrTitle.trim());
    formData.append('project_id', projectId);
    formData.append('user_id', projectData?.project?.user_id || '');
    formData.append('file', agrFile);

    try {
      const res = await axios.post('/api/team/agreements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Agreement document created and sent to customer!');
        setShowAgreementForm(false);
        setAgrTitle('');
        setAgrFile(null);
        fetchWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to create agreement');
      }
    } catch {
      toast.error('Error creating agreement document');
    } finally {
      setCreatingAgreement(false);
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
          <h2 className="text-lg font-bold text-slate-800">Project Workspace Not Found</h2>
          <p className="text-xs text-slate-500">The requested project record does not exist.</p>
          <Link
            href="/team/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-sky-600 transition-all shadow-md"
          >
            <FiArrowLeft size={14} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const { project, messages, attachments, purchases, agreements } = projectData;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/team/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <FiArrowLeft size={16} /> Back to Customer Projects
          </Link>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Status:</span>
            <select
              value={project.status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="working">Working</option>
              <option value="ready">Ready</option>
              <option value="ontest">Quality Control (On Test)</option>
              <option value="fixing">Fixing</option>
              <option value="approved">Approved / Completed</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">{project.title}</h1>
          <p className="text-xs text-slate-500">
            Client: <span className="font-bold text-slate-800">{project.user_name || 'Customer'} ({project.user_email})</span>
            {project.product_name && <span> · Base Product: <strong>{project.product_name}</strong></span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Discussion Thread (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col min-h-[500px]">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiMessageSquare className="text-sky-500" size={18} />
              Project Live Discussion Workspace
            </h2>

            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[440px]">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No discussion messages recorded. Send your staff response below!
                </div>
              ) : (
                messages.map((m) => {
                  const isStaff = !!m.team_id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`p-4 rounded-2xl max-w-lg space-y-1 text-xs shadow-sm ${
                        isStaff
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 border-b border-white/20 pb-1 mb-1">
                          <span className="font-bold">{isStaff ? `${m.team_name || 'Staff'} (${m.team_role || 'Staff'})` : `${m.user_name || 'Customer'}`}</span>
                          <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Staff Reply Form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type staff response..."
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
                  Reply
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

        {/* Manual Purchases, Payments & Agreements Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Manual Purchase Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FiCreditCard className="text-emerald-500" size={16} />
                Billing & Manual Purchase
              </h3>

              <button
                onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <FiPlus size={14} /> Create Purchase
              </button>
            </div>

            {/* Manual Purchase Creator Form */}
            {showPurchaseForm && (
              <form onSubmit={handleCreatePurchase} className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Product</label>
                  <select
                    value={purProductId}
                    onChange={e => setPurProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="">-- Custom Service Proposal --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Proposal Price ($) *</label>
                    <input
                      type="number"
                      required
                      value={purPrice}
                      onChange={e => setPurPrice(e.target.value)}
                      placeholder="E.g. 500"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={purDiscount}
                      onChange={e => setPurDiscount(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPurchaseForm(false)}
                    className="px-3 py-1.5 text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingPurchase}
                    className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    {creatingPurchase ? 'Creating...' : 'Generate Invoice'}
                  </button>
                </div>
              </form>
            )}

            {/* List Existing Purchases & Payments */}
            {purchases.length === 0 ? (
              <p className="text-xs text-slate-400">No manual purchases generated yet.</p>
            ) : (
              purchases.map(pur => (
                <div key={pur.purchase_id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Proposal Amount</span>
                    <span className="font-extrabold text-slate-900">${pur.price} ({pur.discount}% Discount)</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span>Paid: <strong>${pur.paid || 0}</strong></span>
                    <span>Due: <strong>${pur.due || pur.price}</strong></span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      pur.payment_status === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {pur.payment_status || 'unpaid'}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    {pur.payment_status !== 'paid' && (
                      <button
                        onClick={() => handleUpdatePaymentStatus(pur.payment_id, 'paid', pur.payment_price || pur.price)}
                        disabled={updatingPaymentId === pur.payment_id}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm text-[11px]"
                      >
                        Mark Completed & Paid
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Agreements Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FiFileText className="text-sky-500" size={16} />
                Project Agreements
              </h3>

              <button
                onClick={() => setShowAgreementForm(!showAgreementForm)}
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <FiPlus size={14} /> Add Agreement
              </button>
            </div>

            {/* Agreement Creator Form */}
            {showAgreementForm && (
              <form onSubmit={handleCreateAgreement} className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agreement Document Title *</label>
                  <input
                    type="text"
                    required
                    value={agrTitle}
                    onChange={e => setAgrTitle(e.target.value)}
                    placeholder="E.g. Service Level Agreement & Scope"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attach PDF Document *</label>
                  <input
                    type="file"
                    ref={agrFileInputRef}
                    onChange={e => setAgrFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => agrFileInputRef.current?.click()}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <FiPaperclip size={14} />
                    {agrFile ? agrFile.name : 'Select PDF Document'}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAgreementForm(false)}
                    className="px-3 py-1.5 text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingAgreement}
                    className="px-4 py-1.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-all shadow-sm"
                  >
                    {creatingAgreement ? 'Uploading...' : 'Send Agreement'}
                  </button>
                </div>
              </form>
            )}

            {/* List Existing Agreements */}
            {agreements.length === 0 ? (
              <p className="text-xs text-slate-400">No project agreement generated yet.</p>
            ) : (
              agreements.map(agr => (
                <div key={agr.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 truncate">{agr.title}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      agr.status === 'signed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : agr.status === 'rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {agr.status}
                    </span>
                  </div>

                  <a
                    href={agr.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <FiExternalLink size={12} /> View Document
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
