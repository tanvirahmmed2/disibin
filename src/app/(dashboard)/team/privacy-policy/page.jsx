'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiShield, FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiCheckCircle, FiXCircle, FiRefreshCw,
  FiEye, FiFileText
} from 'react-icons/fi';
import PrivacyPolicyForm from '@/component/team/forms/PrivacyPolicyForm';

export default function TeamPrivacyPolicyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order_num: 0,
    is_published: true
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/privacy-policy');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Access Denied: Only Managers can manage Privacy Policy');
      } else {
        toast.error('Failed to load Privacy Policy entries');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      order_num: data.length + 1,
      is_published: true
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
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
    if (!formData.title.trim()) return toast.error('Title is required');
    if (!formData.content.trim()) return toast.error('Content is required');

    setSaving(true);
    try {
      if (editingItem) {
        const res = await axios.put('/api/team/privacy-policy', {
          id: editingItem.id,
          ...formData
        });
        if (res.data.success) {
          toast.success('Privacy Policy item updated successfully');
          setShowForm(false);
          setEditingItem(null);
          fetchPolicies();
        }
      } else {
        const res = await axios.post('/api/team/privacy-policy', formData);
        if (res.data.success) {
          toast.success('Privacy Policy item created successfully');
          setShowForm(false);
          fetchPolicies();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Privacy Policy item?')) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`/api/team/privacy-policy?id=${id}`);
      if (res.data.success) {
        toast.success('Item deleted successfully');
        fetchPolicies();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      const res = await axios.put('/api/team/privacy-policy', {
        id: item.id,
        is_published: !item.is_published
      });
      if (res.data.success) {
        toast.success('Publish status updated');
        fetchPolicies();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update publish state');
    }
  };

  const filteredData = data.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 w-full mx-auto min-h-screen pb-24">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-tertiary p-6 sm:p-8 rounded-3xl text-primary shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Privacy Policy Management</h1>
          <p className=" text-sm mt-1 max-w-xl">
            Create, update, and publish official Privacy Policy items. Restricted exclusively to authorized managers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl  text-slate-900 hover:bg-primary/10 text-sm font-semibold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <FiPlus className="w-5 h-5 text-primary" /> Create Privacy Policy Item
        </button>
      </div>

      {/* Inline Form Component for Privacy Policy */}
      {showForm && (
        <PrivacyPolicyForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleCancel={handleCancelForm}
          saving={saving}
          isEditing={Boolean(editingItem)}
        />
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Privacy Policy records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-style pl-10 pr-4 text-sm py-2"
          />
        </div>

        <button
          onClick={fetchPolicies}
          className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm"
          title="Refresh list"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <FiRefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-slate-500 font-medium text-sm">Loading Privacy Policy entries...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <FiFileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Privacy Policy items</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">
            There are no Privacy Policy items created yet. Click below to add one.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-md"
          >
            <FiPlus className="w-4 h-4" /> Add Privacy Policy Item
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Created By</th>
                  <th className="py-4 px-6">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-500 font-bold">#{item.order_num || 0}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
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
                            <FiXCircle className="w-3.5 h-3.5" /> Draft / Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      {item.creator_name || 'System'}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {new Date(item.updated_at || item.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="View Public Page"
                      >
                        <FiEye className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Edit Item"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Item"
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
