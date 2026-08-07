'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHandshake } from 'react-icons/fa';
import { FiArrowLeft, FiUpload, FiGlobe, FiMail, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function NewPartnerPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    company_name: '',
    business_url: '',
    email: '',
    image: '',
    image_id: '',
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setForm((prev) => ({
          ...prev,
          image: res.data.data.url,
          image_id: res.data.data.public_id,
        }));
        toast.success('Partner logo uploaded!');
      } else {
        toast.error(res.data.message || 'Upload failed');
      }
    } catch {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name.trim()) return toast.error('Company name is required');
    if (!form.image) return toast.error('Partner logo is required');
    if (!form.email.trim()) return toast.error('Contact email is required');

    setSaving(true);
    try {
      const res = await axios.post('/api/public/partner', form);
      if (res.data.success) {
        toast.success('Partner created successfully!');
        router.push('/team/partners');
      } else {
        toast.error(res.data.message || 'Failed to create partner');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/team/partners"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Partners
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2">
            <FaHandshake size={14} /> Partner Ecosystem
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Add New Industry Partner
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Publish an enterprise partner logo and details to the partner showcase section
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Logo Upload Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Partner Logo Image *
            </label>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-sm">
                {form.image ? (
                  <img src={form.image} alt="Logo preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <FaHandshake className="text-slate-300" size={32} />
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-primary transition-colors disabled:bg-slate-400 cursor-pointer"
                >
                  <FiUpload size={14} /> {uploading ? 'Uploading...' : 'Upload Logo'}
                </button>
                <p className="text-xs text-slate-400 font-medium">
                  PNG, SVG, or JPG format (transparent background recommended)
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Company / Organization Name *
              </label>
              <input
                type="text"
                name="company_name"
                placeholder="e.g. Acme Tech Global"
                value={form.company_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Contact Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="partner@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Business Website URL
            </label>
            <div className="relative">
              <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="url"
                name="business_url"
                placeholder="https://company.com"
                value={form.business_url}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Link
              href="/team/partners"
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-primary transition-colors disabled:bg-slate-400 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              <FiCheck size={16} /> {saving ? 'Saving Partner...' : 'Create Partner'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
