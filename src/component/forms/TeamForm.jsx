'use client';
import React, { useState, useEffect } from 'react';
import { FiUser, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

/**
 * TeamForm
 * --------
 * Form to add or edit a team member.
 * Handles image upload to Cloudinary via /api/image.
 *
 * Props
 *   initialData — member object (Edit mode) | null (Create mode)
 *   onSuccess   — (member) => void
 *   onCancel    — () => void
 */
const TeamForm = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    post: '',
    email: '',
    image: '',
    image_id: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        post: initialData.post || '',
        email: initialData.email || '',
        image: initialData.image || '',
        image_id: initialData.image_id || '',
        bio: initialData.bio || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormData({
          ...formData,
          image: res.data.data.url,
          image_id: res.data.data.public_id
        });
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, image: '', image_id: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.post) {
      return toast.error('Name and Post are required');
    }

    setLoading(true);
    try {
      let res;
      if (initialData) {
        res = await axios.patch('/api/team', {
          memberId: initialData.member_id,
          ...formData,
        });
      } else {
        res = await axios.post('/api/team', formData);
      }

      if (res.data.success) {
        toast.success(`Member ${initialData ? 'updated' : 'added'} successfully`);
        onSuccess?.(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm';
  const labelCls = 'text-xs font-bold uppercase tracking-wider text-slate-400 ml-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelCls}>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. John Doe" required />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Post / Title *</label>
          <input type="text" name="post" value={formData.post} onChange={handleChange} className={inputCls} placeholder="e.g. Senior Developer" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls}>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="e.g. john@example.com" />
      </div>

      {/* Image Upload */}
      <div className="space-y-1.5">
        <label className={labelCls}>Avatar Image</label>
        
        {formData.image ? (
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 group">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-rose-500 hover:bg-white hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
              title="Remove Image"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-2" />
                ) : (
                  <FiUpload className="text-slate-400 mb-2" size={20} />
                )}
                <p className="text-xs text-slate-500">
                  {uploading ? 'Uploading...' : 'Click to upload image'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG or WEBP</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
            </label>
          </div>
        )}
        
        {formData.image_id && (
          <div className="text-xs text-slate-400 mt-1">
            Cloudinary ID: <span className="font-mono">{formData.image_id}</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={labelCls}>Bio</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Short bio..." />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading || uploading} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50">
          {loading ? 'Saving...' : initialData ? 'Update Member' : 'Add Member'}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
