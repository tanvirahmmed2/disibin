'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiLayout, FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiX, FiMail, FiBriefcase, FiLoader, FiUploadCloud,
  FiUser, FiRefreshCw, FiExternalLink
} from 'react-icons/fi';

export default function TeamBoardPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form / Inline Drawer State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    post: '',
    email: '',
    bio: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const fetchBoardMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/board');
      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch {
      toast.error('Failed to load board members');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ name: '', post: '', email: '', bio: '' });
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEditForm = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name || '',
      post: member.post || '',
      email: member.email || '',
      bio: member.bio || ''
    });
    setImageFile(null);
    setImagePreview(member.image || '');
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.post.trim()) {
      return toast.error('Full name and Post Title are required');
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('post', form.post.trim());
    formData.append('email', form.email.trim());
    formData.append('bio', form.bio.trim());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingId) {
        // Edit Mode
        const res = await axios.patch(`/api/team/board/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          toast.success('Board member updated');
          setMembers(prev => prev.map(m => m.id === editingId ? res.data.data : m));
          setShowForm(false);
        } else {
          toast.error(res.data.message || 'Failed to update board member');
        }
      } else {
        // Create Mode
        const res = await axios.post('/api/team/board', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          toast.success('Board member added successfully');
          setMembers(prev => [res.data.data, ...prev]);
          setShowForm(false);
        } else {
          toast.error(res.data.message || 'Failed to add board member');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving board member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete board member "${member.name}"?`)) return;

    setDeletingId(member.id);
    try {
      const res = await axios.delete(`/api/team/board?id=${member.id}`);
      if (res.data.success) {
        toast.success('Board member removed');
        setMembers(prev => prev.filter(m => m.id !== member.id));
      } else {
        toast.error(res.data.message || 'Failed to delete board member');
      }
    } catch {
      toast.error('Failed to remove board member');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = members.filter(m => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.post?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.bio?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
              <FiLayout size={20} />
            </span>
            Executive & Advisory Board
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Manage board members, executive positions, and leadership profiles
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchBoardMembers}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs"
            title="Refresh List"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          </button>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
          >
            <FiPlus size={16} /> Add Board Member
          </button>
        </div>
      </div>

      {/* Form Drawer / Container */}
      {showForm && (
        <div className="bg-white p-6 rounded-3xl border border-violet-100 shadow-lg space-y-4 animate-fade-down">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FiBriefcase className="text-violet-500" size={18} />
              {editingId ? 'Edit Board Member' : 'Add New Executive / Advisory Board Member'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
            >
              <FiX size={16} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="E.g. Dr. Eleanor Vance"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Post Title / Role *
                </label>
                <input
                  type="text"
                  required
                  value={form.post}
                  onChange={e => setForm({ ...form, post: e.target.value })}
                  placeholder="E.g. Chairman of the Board / Strategic Advisor"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="eleanor@disibin.com"
                  className="input-style text-sm py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Profile Photo (Cloudinary)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="input-style"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200"
                  >
                    <FiUploadCloud size={15} />
                    {imageFile ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Biography / Summary
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Short background summary, achievements, or domain expertise..."
                className="input-style text-sm resize-none py-2"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
              >
                {saving ? <FiLoader className="animate-spin" size={14} /> : null}
                {saving ? 'Saving Member...' : editingId ? 'Update Board Member' : 'Add Board Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, post title, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-style pl-10 pr-9 text-sm py-2"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Showing {filtered.length} of {members.length} board members
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-violet-500" size={28} />
            <p className="text-sm font-medium">Loading board members...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiLayout className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No board members recorded</p>
            <p className="text-xs text-slate-500">Click "Add Board Member" to add your first executive or advisory member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Board Member</th>
                  <th className="px-6 py-4">Post Title / Position</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 max-w-xs">Biography</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 font-bold flex items-center justify-center text-sm shrink-0 border border-violet-100">
                            {m.name?.charAt(0) || 'B'}
                          </div>
                        )}
                        <Link href={`/team/board/${m.id}`} className="font-bold text-slate-900 hover:text-violet-600 transition-colors">
                          {m.name}
                        </Link>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-xs">
                        {m.post}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {m.email ? (
                        <a href={`mailto:${m.email}`} className="text-violet-600 hover:underline flex items-center gap-1">
                          <FiMail size={12} /> {m.email}
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate" title={m.bio}>
                      {m.bio || '—'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/team/board/${m.id}`}
                          className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                          title="View Profile Details"
                        >
                          <FiExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => openEditForm(m)}
                          className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                          title="Edit Board Member"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          disabled={deletingId === m.id}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-40"
                          title="Delete Member"
                        >
                          {deletingId === m.id ? <FiLoader className="animate-spin" size={16} /> : <FiTrash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
