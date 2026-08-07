'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiUser, FiMail, FiBriefcase,
  FiUploadCloud, FiTrash2, FiSave, FiLoader, FiAlertCircle
} from 'react-icons/fi';

export default function BoardMemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', post: '', email: '', bio: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (memberId) fetchMemberDetails();
  }, [memberId]);

  const fetchMemberDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/team/board/${memberId}`);
      if (res.data.success) {
        const data = res.data.data;
        setMember(data);
        setForm({
          name: data.name || '',
          post: data.post || '',
          email: data.email || '',
          bio: data.bio || ''
        });
        setImagePreview(data.image || '');
      } else {
        toast.error(res.data.message || 'Board member not found');
      }
    } catch {
      toast.error('Failed to load board member details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
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
      const res = await axios.patch(`/api/team/board/${memberId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Board member details updated');
        setMember(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to update details');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete board member "${member?.name}"?`)) return;

    setDeleting(true);
    try {
      const res = await axios.delete(`/api/team/board?id=${memberId}`);
      if (res.data.success) {
        toast.success('Board member removed');
        router.push('/team/board');
      } else {
        toast.error(res.data.message || 'Failed to delete member');
      }
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3 p-6 text-slate-400">
        <FiLoader className="animate-spin text-primary" size={28} />
        <p className="text-sm font-medium">Loading board member details...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4 text-center">
        <Toaster position="top-center" />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <FiAlertCircle className="mx-auto text-secondary" size={36} />
          <h2 className="text-lg font-bold text-slate-800">Board Member Not Found</h2>
          <p className="text-xs text-slate-500">The requested board member record does not exist.</p>
          <Link
            href="/team/board"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-violet-600 transition-all shadow-md"
          >
            <FiArrowLeft size={14} /> Back to Board Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/team/board"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Board Members
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all border border-rose-100 disabled:opacity-50"
        >
          {deleting ? <FiLoader className="animate-spin" size={14} /> : <FiTrash2 size={14} />}
          Delete Member
        </button>
      </div>

      {/* Card Detail Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={form.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 shadow-md shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary font-extrabold text-3xl flex items-center justify-center shrink-0 border-2 border-violet-100 shadow-md">
              {form.name?.charAt(0) || 'B'}
            </div>
          )}

          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-slate-900">{form.name || 'Board Member'}</h1>
            <p className="text-xs font-bold text-primary bg-primary/10 inline-block px-3 py-1 rounded-full">
              {form.post || 'Executive Role'}
            </p>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="input-style"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1.5 mx-auto sm:mx-0"
              >
                <FiUploadCloud size={14} /> Change Profile Photo
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
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
                className="input-style text-sm py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Post Title / Position *
              </label>
              <input
                type="text"
                required
                value={form.post}
                onChange={e => setForm({ ...form, post: e.target.value })}
                className="input-style text-sm py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="input-style text-sm py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Biography / Summary
            </label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className="input-style text-sm resize-none py-2"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
            >
              {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
