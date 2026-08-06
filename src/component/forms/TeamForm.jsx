'use client';
import React, { useState, useEffect } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

/**
 * TeamForm
 * --------
 * Form to add or edit a team member.
 * Sends raw files directly to /api/team via FormData.
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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

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
      setImagePreview(initialData.image || '');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '', image_id: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.post || !formData.email) {
      return toast.error('Name, Post and Email are required');
    }
    if (!imagePreview) {
      return toast.error('Avatar Image is required');
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('post', formData.post);
      if (formData.email) submitData.append('email', formData.email);
      if (formData.bio) submitData.append('bio', formData.bio);

      if (imageFile) {
        // Send new uploaded raw file
        submitData.append('image', imageFile);
      } else {
        // Keeping current image or cleared
        if (formData.image) submitData.append('image', formData.image);
        if (formData.image_id) submitData.append('image_id', formData.image_id);
      }

      let res;
      if (initialData) {
        submitData.append('memberId', initialData.member_id);
        res = await axios.patch('/api/team', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post('/api/team', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
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

  const inputCls = 'input-style';
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
        <label className={labelCls}>Email *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="e.g. john@example.com" required />
      </div>

      {/* Image Upload */}
      <div className="space-y-1.5">
        <label className={labelCls}>Avatar Image *</label>
        
        {imagePreview ? (
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 group">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                <FiUpload className="text-slate-400 mb-2" size={20} />
                <p className="text-xs text-slate-500">Click to upload image</p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG or WEBP</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>
          </div>
        )}
        
        {formData.image_id && !imageFile && (
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
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50">
          {loading ? 'Saving...' : initialData ? 'Update Member' : 'Add Member'}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
