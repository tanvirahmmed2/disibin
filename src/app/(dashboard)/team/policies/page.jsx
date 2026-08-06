'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiFileText, FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiX, FiCheckCircle, FiXCircle, FiRefreshCw, FiShield,
  FiEye, FiCheck, FiLayers
} from 'react-icons/fi';

const TABS = [
  { key: 'privacy', label: 'Privacy Policy', endpoint: '/api/team/privacy-policy', publicUrl: '/privacy-policy' },
  { key: 'terms', label: 'Terms & Conditions', endpoint: '/api/team/terms-of-service', publicUrl: '/terms-of-service' },
  { key: 'refund', label: 'Refund Conditions', endpoint: '/api/team/refund-policy', publicUrl: '/refund-policy' },
];

export default function TeamPoliciesPage() {
  const [activeTab, setActiveTab] = useState('privacy');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_published: true
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const currentTabInfo = TABS.find(t => t.key === activeTab);

  useEffect(() => {
    fetchPolicies();
  }, [activeTab]);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(currentTabInfo.endpoint);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('Access Denied: Only Managers can manage policies');
      } else {
        toast.error(`Failed to load ${currentTabInfo.label}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: `${currentTabInfo.label}`,
      content: '',
      is_published: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      is_published: Boolean(item.is_published)
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Title is required');
    if (!formData.content.trim()) return toast.error('Content is required');

    setSaving(true);
    try {
      if (editingItem) {
        // PUT update
        const res = await axios.put(currentTabInfo.endpoint, {
          id: editingItem.id,
          ...formData
        });
        if (res.data.success) {
          toast.success(`${currentTabInfo.label} updated successfully`);
          setShowModal(false);
          fetchPolicies();
        }
      } else {
        // POST create
        const res = await axios.post(currentTabInfo.endpoint, formData);
        if (res.data.success) {
          toast.success(`${currentTabInfo.label} created successfully`);
          setShowModal(false);
          fetchPolicies();
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this record?`)) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${currentTabInfo.endpoint}?id=${id}`);
      if (res.data.success) {
        toast.success('Record deleted successfully');
        fetchPolicies();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete record';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      const res = await axios.put(currentTabInfo.endpoint, {
        id: item.id,
        is_published: !item.is_published
      });
      if (res.data.success) {
        toast.success(`Published status updated`);
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen pb-24">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-slate-900 via-primary to-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-widest mb-2">
            <FiShield className="w-4 h-4" /> Manager Operations
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Legal Policies & Terms</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Manage Privacy Policies, Terms & Conditions, and Refund Conditions. Only authorized managers can create, edit, or delete documents.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-sky-50 text-sm font-semibold transition-all shadow-lg shrink-0"
        >
          <FiPlus className="w-5 h-5 text-primary" /> Create {currentTabInfo.label}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FiLayers className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 w-48 sm:w-64"
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
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <FiRefreshCw className="w-8 h-8 text-sky-500 animate-spin mb-3" />
          <p className="text-slate-500 font-medium text-sm">Loading {currentTabInfo.label} records...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <FiFileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No records found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">
            There are no {currentTabInfo.label} entries created yet. Click below to add the first document.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-md"
          >
            <FiPlus className="w-4 h-4" /> Add First {currentTabInfo.label}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">ID</th>
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
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">#{item.id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          item.is_published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
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
                        href={currentTabInfo.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                        title="View Public Page"
                      >
                        <FiEye className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Edit Document"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Document"
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

      {/* Modal Drawer for Create / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FiFileText className="text-sky-600" />
                {editingItem ? `Edit ${currentTabInfo.label}` : `Create New ${currentTabInfo.label}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. Disibin ${currentTabInfo.label}`}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Document Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={12}
                  placeholder="Enter policy content or HTML/markdown formatted text..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Publish Document (Make visible on public website)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" /> {editingItem ? 'Update Document' : 'Save Document'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
