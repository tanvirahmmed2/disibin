'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiSend, FiPaperclip,
  FiCreditCard, FiFileText, FiLoader, FiExternalLink, FiPlus, FiAlertCircle
} from 'react-icons/fi';

export default function TeamProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;

  const [projectData, setProjectData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat & file state
  const [message, setMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Purchase Form
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purProductId, setPurProductId] = useState('');
  const [purPrice, setPurPrice] = useState('');
  const [purDiscount, setPurDiscount] = useState('0');
  const [creatingPurchase, setCreatingPurchase] = useState(false);

  // Payment Status
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);

  // Agreement Form
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
        toast.error(res.data.message || 'Project not found');
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
        toast.success('Purchase created!');
        setShowPurchaseForm(false);
        setPurPrice('');
        fetchWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to create purchase');
      }
    } catch {
      toast.error('Failed to create purchase');
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
      toast.error('Error updating payment');
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const handleCreateAgreement = async (e) => {
    e.preventDefault();
    if (!agrTitle.trim()) return toast.error('Title is required');
    if (!agrFile) return toast.error('Please select document PDF');

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
        toast.success('Agreement document created!');
        setShowAgreementForm(false);
        setAgrTitle('');
        setAgrFile(null);
        fetchWorkspace();
      } else {
        toast.error(res.data.message || 'Failed to create agreement');
      }
    } catch {
      toast.error('Error creating agreement');
    } finally {
      setCreatingAgreement(false);
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
          href="/team/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
        >
          <FiArrowLeft size={14} /> Back to Projects
        </Link>
      </div>
    );
  }

  const { project, messages, attachments, purchases, agreements } = projectData;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <Toaster position="top-center" />

      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/team/projects"
            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
            title="Back to Projects"
          >
            <FiArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900">{project.title}</h1>
            <p className="text-xs text-slate-500">
              Customer: <strong className="text-slate-800">{project.user_name || 'Customer'}</strong> ({project.user_email})
              {project.product_name && <span> · Base: {project.product_name}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={project.status}
            disabled={updatingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="pending">Pending</option>
            <option value="working">Working</option>
            <option value="ready">Ready</option>
            <option value="ontest">Testing</option>
            <option value="fixing">Fixing</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Messages */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[480px]">
            <div className="p-3 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-700">
              Live Discussion Workspace
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No discussion messages recorded. Send your staff response below.
                </div>
              ) : (
                messages.map((m) => {
                  const isStaff = !!m.team_id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isStaff ? 'items-end ml-auto' : 'items-start mr-auto'} max-w-[85%] sm:max-w-[75%]`}
                    >
                      <div className="text-[11px] font-semibold text-slate-500 mb-0.5 px-1">
                        {isStaff ? `${m.team_name || 'Staff'} (${m.team_role || 'Staff'})` : (m.user_name || 'Customer')}
                      </div>
                      <div className={`p-3 rounded-xl text-xs leading-relaxed max-w-md ${
                        isStaff ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'
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

            {/* Staff Reply Form */}
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
                placeholder="Type staff response..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary"
              />

              <button
                type="submit"
                disabled={sending || (!message.trim() && !attachmentFile)}
                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {sending ? <FiLoader className="animate-spin" size={13} /> : <FiSend size={13} />}
                Reply
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-3 text-xs">
          {/* Billing & Purchase */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FiCreditCard size={14} className="text-slate-500" /> Billing & Purchases
              </h3>
              <button
                onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <FiPlus size={13} /> New Purchase
              </button>
            </div>

            {showPurchaseForm && (
              <form onSubmit={handleCreatePurchase} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product</label>
                  <select
                    value={purProductId}
                    onChange={e => setPurProductId(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                  >
                    <option value="">Custom Service Proposal</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      required
                      value={purPrice}
                      onChange={e => setPurPrice(e.target.value)}
                      placeholder="Price"
                      className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={purDiscount}
                      onChange={e => setPurDiscount(e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPurchaseForm(false)}
                    className="px-2.5 py-1 text-slate-500 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingPurchase}
                    className="px-3 py-1 bg-emerald-600 text-white font-semibold rounded"
                  >
                    {creatingPurchase ? 'Saving...' : 'Create Invoice'}
                  </button>
                </div>
              </form>
            )}

            {purchases.length === 0 ? (
              <p className="text-slate-400">No purchases generated yet.</p>
            ) : (
              purchases.map(pur => (
                <div key={pur.purchase_id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Proposal</span>
                    <span className="font-bold text-slate-900">${pur.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Payment Status</span>
                    <span className="font-semibold uppercase">{pur.payment_status || 'unpaid'}</span>
                  </div>
                  {pur.payment_status !== 'paid' && (
                    <div className="pt-1 text-right">
                      <button
                        onClick={() => handleUpdatePaymentStatus(pur.payment_id, 'paid', pur.payment_price || pur.price)}
                        disabled={updatingPaymentId === pur.payment_id}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded font-semibold text-[11px]"
                      >
                        Mark Paid
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Agreements */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FiFileText size={14} className="text-slate-500" /> Agreements
              </h3>
              <button
                onClick={() => setShowAgreementForm(!showAgreementForm)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <FiPlus size={13} /> Add Document
              </button>
            </div>

            {showAgreementForm && (
              <form onSubmit={handleCreateAgreement} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={agrTitle}
                    onChange={e => setAgrTitle(e.target.value)}
                    placeholder="E.g. Scope of Work"
                    className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PDF File *</label>
                  <input
                    type="file"
                    ref={agrFileInputRef}
                    onChange={e => setAgrFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx"
                    className="w-full text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAgreementForm(false)}
                    className="px-2.5 py-1 text-slate-500 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingAgreement}
                    className="px-3 py-1 bg-primary text-white font-semibold rounded"
                  >
                    {creatingAgreement ? 'Uploading...' : 'Send Document'}
                  </button>
                </div>
              </form>
            )}

            {agreements.length === 0 ? (
              <p className="text-slate-400">No agreement document added.</p>
            ) : (
              agreements.map(agr => (
                <div key={agr.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 truncate">{agr.title}</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border border-slate-200">
                      {agr.status}
                    </span>
                  </div>
                  <a
                    href={agr.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <FiExternalLink size={11} /> View Document
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
