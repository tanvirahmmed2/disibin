'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiBriefcase, FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiMail, FiPhone, FiMapPin, FiFileText, FiCalendar,
  FiLoader, FiX, FiRefreshCw, FiCheck
} from 'react-icons/fi';

export default function BusinessLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  // Inline Row Edit State (NO POPUP MODALS)
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '', note: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/leads/business');
      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch {
      toast.error('Failed to load business leads');
    } finally {
      setLoading(false);
    }
  };

  const startInlineEdit = (lead) => {
    setEditingId(lead.id);
    setEditForm({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      address: lead.address || '',
      note: lead.note || ''
    });
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
  };

  const handleSaveInlineEdit = async (id) => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      return toast.error('Business name and email are required');
    }

    setSavingEdit(true);
    try {
      const res = await axios.patch(`/api/team/leads/business/${id}`, editForm);
      if (res.data.success) {
        toast.success('Business lead updated');
        setLeads(prev => prev.map(l => l.id === id ? res.data.data : l));
        setEditingId(null);
      } else {
        toast.error(res.data.message || 'Failed to update lead');
      }
    } catch {
      toast.error('Error saving business lead');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Are you sure you want to delete lead "${lead.name}"?`)) return;
    setDeleting(lead.id);
    try {
      const res = await axios.delete(`/api/team/leads/business/${lead.id}`);
      if (res.data.success) {
        toast.success('Business lead removed');
        setLeads(prev => prev.filter(l => l.id !== lead.id));
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setDeleting(null);
    }
  };

  const filteredLeads = leads.filter(l => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      l.name?.toLowerCase().includes(term) ||
      l.email?.toLowerCase().includes(term) ||
      l.phone?.toLowerCase().includes(term) ||
      l.address?.toLowerCase().includes(term) ||
      l.note?.toLowerCase().includes(term)
    );
  });

  const totalLeads = leads.length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <FiBriefcase size={20} />
            </span>
            Business Leads
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Manage corporate leads, enterprise contacts, and business partnerships
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-all shadow-sm"
            title="Refresh Leads"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          </button>

          <Link
            href="/team/leads/business/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
          >
            <FiPlus size={16} /> Add New Business Lead
          </Link>
        </div>
      </div>

      {/* Stat Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 font-bold">
            <FiBriefcase size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Business Leads</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : totalLeads}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
            <FiMail size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Contact Emails</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : leads.filter(l => l.email).length}</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search business leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-style pl-10 pr-9 py-2 text-sm shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Showing {filteredLeads.length} of {totalLeads} entries
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-secondary" size={28} />
            <p className="text-sm font-medium">Loading business leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FiBriefcase size={32} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-slate-800 text-base">No business leads found</h3>
              <p className="text-xs text-slate-500">
                {search ? 'No results match your search query.' : 'Click "Add New Business Lead" to register your first lead.'}
              </p>
            </div>
            {!search && (
              <Link
                href="/team/leads/business/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-all shadow-md"
              >
                <FiPlus size={14} /> Add New Business Lead
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Business Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Note / Details</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLeads.map((lead) => {
                  const isEditing = editingId === lead.id;

                  if (isEditing) {
                    return (
                      <tr key={lead.id} className="bg-secondary/10/40">
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="input-style py-1.5 text-xs font-bold"
                            placeholder="Business Name *"
                          />
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                            className="input-style py-1.5 text-xs"
                            placeholder="Email *"
                          />
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                            className="input-style py-1.5 text-xs"
                            placeholder="Phone"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.address}
                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                            className="input-style py-1.5 text-xs"
                            placeholder="Address"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.note}
                            onChange={e => setEditForm({ ...editForm, note: e.target.value })}
                            className="input-style py-1.5 text-xs"
                            placeholder="Note"
                          />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                          Editing...
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <button
                            onClick={() => handleSaveInlineEdit(lead.id)}
                            disabled={savingEdit}
                            className="p-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all disabled:opacity-50"
                            title="Save Changes"
                          >
                            {savingEdit ? <FiLoader className="animate-spin" size={14} /> : <FiCheck size={14} />}
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            className="p-2 text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg transition-all"
                            title="Cancel"
                          >
                            <FiX size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {lead.name}
                      </td>

                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 text-xs">
                          <FiMail className="text-secondary shrink-0" size={13} />
                          <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <FiPhone className="text-primary shrink-0" size={13} />
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                        {lead.address ? (
                          <span className="flex items-center gap-1.5">
                            <FiMapPin className="text-rose-500 shrink-0" size={13} />
                            {lead.address}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {lead.note ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                            <FiFileText size={11} />
                            {lead.note}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-1">
                        <button
                          onClick={() => startInlineEdit(lead)}
                          className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                          title="Edit Lead Inline"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          disabled={deleting === lead.id}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                          title="Delete Lead"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
