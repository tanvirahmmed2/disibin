'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiHelpCircle, FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiCheckCircle, FiXCircle, FiRefreshCw, FiEye
} from 'react-icons/fi';
import FaqForm from '@/component/team/forms/FaqForm';

export default function TeamFaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order_num: 0,
    is_published: true
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/faq');
      if (res.data.success) {
        setFaqs(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Access Denied: Only Managers can manage FAQs');
      } else {
        toast.error('Failed to load FAQs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      question: '',
      answer: '',
      order_num: faqs.length + 1,
      is_published: true
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      order_num: item.order_num || 0,
      is_published: Boolean(item.is_published)
    });
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) return toast.error('Question is required');
    if (!formData.answer.trim()) return toast.error('Answer is required');

    setSaving(true);
    try {
      if (editingItem) {
        const res = await axios.put('/api/team/faq', {
          id: editingItem.id,
          ...formData
        });
        if (res.data.success) {
          toast.success('FAQ updated successfully');
          setShowForm(false);
          setEditingItem(null);
          fetchFaqs();
        }
      } else {
        const res = await axios.post('/api/team/faq', formData);
        if (res.data.success) {
          toast.success('FAQ created successfully');
          setShowForm(false);
          fetchFaqs();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`/api/team/faq?id=${id}`);
      if (res.data.success) {
        toast.success('FAQ deleted successfully');
        fetchFaqs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete FAQ');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      const res = await axios.put('/api/team/faq', {
        id: item.id,
        is_published: !item.is_published
      });
      if (res.data.success) {
        toast.success('Publish status updated');
        fetchFaqs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update publish state');
    }
  };

  const filteredFaqs = faqs.filter(item => {
    const q = search.toLowerCase();
    return (
      item.question?.toLowerCase().includes(q) ||
      item.answer?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 w-full min-h-screen pb-24">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 sm:p-8 rounded-3xl text-primary shadow-sm bg-white border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Frequently Asked Questions</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-medium">
            Manage FAQs for public users. Add, update, reorder, or toggle publication state.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center cursor-pointer gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-md shadow-primary/20 shrink-0"
        >
          <FiPlus className="w-5 h-5" /> Create New FAQ
        </button>
      </div>

      {/* Inline Form Component */}
      {showForm && (
        <FaqForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleCancel={handleCancelForm}
          saving={saving}
          isEditing={Boolean(editingItem)}
        />
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
        <div className="text-xs font-bold text-slate-500">
          Total FAQs: <span className="text-primary font-black">{faqs.length}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 text-sm py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={fetchFaqs}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm cursor-pointer"
            title="Refresh list"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <FiRefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-slate-500 font-medium text-sm">Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <FiHelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No FAQs found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">
            There are no FAQ entries matching your search.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <FiPlus className="w-4 h-4" /> Add First FAQ
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Question & Answer</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Creator</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredFaqs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-500 font-bold">#{item.order_num || 0}</td>
                    <td className="py-4 px-6 max-w-xl">
                      <p className="font-bold text-slate-900">{item.question}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.answer}</p>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          item.is_published
                            ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                            : 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20'
                        }`}
                      >
                        {item.is_published ? (
                          <>
                            <FiCheckCircle className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <FiXCircle className="w-3.5 h-3.5" /> Hidden / Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                      {item.creator_name || 'System'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <a
                        href="/faq"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="View Public Page"
                      >
                        <FiEye className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 text-slate-600 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors cursor-pointer"
                        title="Edit FAQ"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete FAQ"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
