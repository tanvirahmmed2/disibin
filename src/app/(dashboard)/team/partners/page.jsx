'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FaHandshake, FaPlus, FaTrash, FaEdit, FaSpinner,
  FaSearch, FaTimes, FaGlobe, FaEnvelope
} from 'react-icons/fa';
import { FiLoader, FiPaperclip, FiX } from 'react-icons/fi';

export default function TeamPartnersManagement() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form & Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [form, setForm] = useState({ company_name: '', business_url: '', email: '', image: '', image_id: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/public/partner');
      if (res.data.success) {
        setPartners(res.data.data);
      }
    } catch {
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPartner(null);
    setForm({ company_name: '', business_url: '', email: '', image: '', image_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (partner) => {
    setEditingPartner(partner);
    setForm({
      company_name: partner.company_name,
      business_url: partner.business_url,
      email: partner.email,
      image: partner.image,
      image_id: partner.image_id
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setForm(prev => ({
          ...prev,
          image: res.data.data.url,
          image_id: res.data.data.public_id
        }));
        toast.success('Logo uploaded successfully');
      } else {
        toast.error(res.data.message || 'Upload failed');
      }
    } catch {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.company_name.trim()) return toast.error('Company name is required');
    if (!form.image) return toast.error('Company logo image is required');
    if (!form.email.trim()) return toast.error('Contact email is required');

    setSaving(true);
    try {
      if (editingPartner) {
        // Update partner
        const res = await axios.patch('/api/public/partner', { id: editingPartner.id, ...form });
        if (res.data.success) {
          toast.success('Partner updated successfully');
          setPartners(prev => prev.map(p => p.id === editingPartner.id ? res.data.data : p));
          setIsModalOpen(false);
        } else {
          toast.error(res.data.message || 'Failed to update partner');
        }
      } else {
        // Create partner
        const res = await axios.post('/api/public/partner', form);
        if (res.data.success) {
          toast.success('Partner created successfully');
          setPartners(prev => [res.data.data, ...prev]);
          setIsModalOpen(false);
        } else {
          toast.error(res.data.message || 'Failed to create partner');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partner) => {
    if (!window.confirm(`Delete partner "${partner.company_name}"? This cannot be undone.`)) return;

    setDeletingId(partner.id);
    try {
      const res = await axios.delete(`/api/public/partner?id=${partner.id}`);
      if (res.data.success) {
        toast.success('Partner deleted');
        setPartners(prev => prev.filter(p => p.id !== partner.id));
      } else {
        toast.error(res.data.message || 'Failed to delete partner');
      }
    } catch {
      toast.error('Failed to delete partner');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPartners = partners.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.company_name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FaHandshake size={20} />
            </span>
            Partners Management
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Manage official business partners displayed across public pages
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 self-start sm:self-auto"
        >
          <FaPlus size={14} />
          Add New Partner
        </button>
      </div>

      {/* Main Grid Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search partner by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-style pl-10 pr-9 text-sm py-2"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FaTimes size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading partner list...</p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FaHandshake size={32} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-slate-800 text-base">No partners found</h3>
              <p className="text-xs text-slate-500">
                {search ? 'No partners match your search term.' : 'Add your first partner to showcase on public pages.'}
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="text-xs text-primary font-bold hover:underline"
            >
              + Add First Partner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredPartners.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.company_name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="font-bold text-primary text-lg">{p.company_name?.charAt(0)}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-primary transition-colors">
                        {p.company_name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">/{p.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="Edit Partner"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deletingId === p.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                      title="Delete Partner"
                    >
                      {deletingId === p.id ? <FiLoader className="animate-spin" size={14} /> : <FaTrash size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <a
                    href={p.business_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary truncate font-medium"
                  >
                    <FaGlobe size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{p.business_url}</span>
                  </a>
                  <div className="flex items-center gap-2 text-slate-500 truncate">
                    <FaEnvelope size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FaHandshake className="text-primary" size={18} />
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
                  placeholder="E.g. Acme Corporation"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Business Website URL *
                  </label>
                  <input
                    type="url"
                    value={form.business_url}
                    onChange={e => setForm(p => ({ ...p, business_url: e.target.value }))}
                    placeholder="https://example.com"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="partner@example.com"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              {/* Company Logo Uploader */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Logo *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="input-style"
                />

                <div className="flex items-center gap-3">
                  {form.image ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                      <img src={form.image} alt="Logo preview" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, image: '', image_id: '' }))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-slate-900/80 text-white rounded-full flex items-center justify-center text-[10px]"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200"
                  >
                    {uploadingImage ? <FiLoader className="animate-spin" size={14} /> : <FiPaperclip size={14} />}
                    {uploadingImage ? 'Uploading Logo...' : form.image ? 'Replace Logo' : 'Upload Logo'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
                >
                  {saving ? <FiLoader className="animate-spin" size={14} /> : null}
                  {saving ? 'Saving...' : editingPartner ? 'Update Partner' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
