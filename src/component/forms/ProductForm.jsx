'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiCheck, FiX, FiZap } from 'react-icons/fi';
import ImageUpload from '@/component/helper/ImageUpload';
import TiptapEditor from '../helper/TiptapEditor';

/* ── Create Feature Modal ─────────────────────────────── */
function CreateFeatureModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) { toast.error('Feature name is required'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/api/team/product/features', {
        name: name.trim(),
        description: description.trim() || null,
      });
      if (res.data.success) {
        toast.success('Feature created!');
        onCreate(res.data.data);   // pass new feature back to form
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to create feature');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center">
              <FiZap className="text-sky-600" size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">New Feature</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feature Name *</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreate(); } if (e.key === 'Escape') onClose(); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm font-semibold text-slate-900 transition-all"
              placeholder="e.g. 24/7 Support"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm text-slate-600 resize-none transition-all"
              placeholder="Brief description of this feature..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <FiPlus size={14} />
            )}
            {loading ? 'Creating...' : 'Create Feature'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Product Form ────────────────────────────────── */
const ProductForm = ({ initialData, onSuccess, onCancel }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    demo_url: '',
    is_featured: true,
    is_published: true,
    ...initialData,
  });

  // All available features from DB
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Selected feature IDs (Set for O(1) toggle)
  const [selectedIds, setSelectedIds] = useState(
    new Set((initialData?.features || []).map(f => f.id))
  );

  const [images, setImages] = useState(
    (initialData?.images || []).map(img => ({
      id: img.id || null,
      title: img.title || '',
      image: img.image || '',
      public_id: img.public_id || '',
      is_primary: img.is_primary || false,
    }))
  );

  const [loading, setLoading] = useState(false);

  // Fetch available features on mount
  useEffect(() => {
    const fetchFeatures = async () => {
      setFeaturesLoading(true);
      try {
        const res = await axios.get('/api/team/product/features');
        if (res.data.success) setAvailableFeatures(res.data.data || []);
      } catch {
        toast.error('Could not load features');
      } finally {
        setFeaturesLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  const toggleFeature = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Called when a new feature is created in the modal
  const handleFeatureCreated = (newFeature) => {
    setAvailableFeatures(prev => [...prev, newFeature].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedIds(prev => new Set([...prev, newFeature.id]));
  };

  const handleImageUpload = (imageData) => {
    setImages(prev => [
      ...prev,
      {
        id: null,
        title: formData.name || '',
        image: imageData.url,
        public_id: imageData.public_id,
        is_primary: prev.length === 0,
      },
    ]);
  };

  const handleSetPrimary = (index) => {
    setImages(images.map((img, i) => ({ ...img, is_primary: i === index })));
  };

  const handleRemoveImage = async (index) => {
    const imgToRemove = images[index];
    if (!imgToRemove.id && imgToRemove.public_id) {
      try { await axios.delete(`/api/image?public_id=${imgToRemove.public_id}`); } catch {}
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Product name is required'); return; }
    setLoading(true);

    // Build features payload from selected IDs
    const featuresPayload = availableFeatures
      .filter(f => selectedIds.has(f.id))
      .map(f => ({ id: f.id, name: f.name, slug: f.slug, value: true }));

    try {
      const isEditing = !!initialData?.slug;
      const url = isEditing ? `/api/team/product/${initialData.slug}` : '/api/team/product';
      const method = isEditing ? 'put' : 'post';

      const payload = {
        name: formData.name.trim(),
        description: formData.description || null,
        demo_url: formData.demo_url || null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        images,
        features: featuresPayload,
      };

      const res = await axios[method](url, payload);

      if (res.data.success) {
        toast.success(res.data.message || 'Product saved successfully');
        if (onSuccess) onSuccess(res.data.data);
        else router.push('/team/products');
      } else {
        toast.error(res.data.message || 'Failed to save product');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <CreateFeatureModal
          onClose={() => setShowModal(false)}
          onCreate={handleFeatureCreated}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left — Core Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="E.g. Enterprise Bundle"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Demo URL</label>
              <input
                type="url"
                name="demo_url"
                value={formData.demo_url || ''}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="https://demo.example.com"
              />
            </div>

            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_published ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                  {formData.is_published && <FiCheck className="text-white" size={13} />}
                </div>
                <input type="checkbox" name="is_published" checked={!!formData.is_published} onChange={handleChange} className="hidden" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Published</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_featured ? 'bg-sky-500 border-sky-500' : 'border-slate-300'}`}>
                  {formData.is_featured && <FiCheck className="text-white" size={13} />}
                </div>
                <input type="checkbox" name="is_featured" checked={!!formData.is_featured} onChange={handleChange} className="hidden" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-sky-600 transition-colors">Featured</span>
              </label>
            </div>
          </div>

          {/* Right — Images */}
          <div className="space-y-4">
            <ImageUpload onUpload={handleImageUpload} label="Upload Product Images" />
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200">
                    <img src={img.image} alt="Product" className="w-full h-24 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className={`p-1.5 rounded-full ${img.is_primary ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 hover:bg-emerald-500 hover:text-white'} transition-colors`}
                        title={img.is_primary ? 'Primary Image' : 'Set as Primary'}
                      >
                        <FiCheck size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 rounded-full bg-white text-slate-700 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Remove Image"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    {img.is_primary && (
                      <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Product Features</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedIds.size > 0
                  ? `${selectedIds.size} feature${selectedIds.size > 1 ? 's' : ''} selected`
                  : 'Select the features this product includes'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-sky-600 transition-all"
            >
              <FiPlus size={14} />
              New Feature
            </button>
          </div>

          {featuresLoading ? (
            <div className="flex items-center justify-center py-12 rounded-2xl border-2 border-dashed border-slate-100">
              <span className="w-6 h-6 border-2 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
              <span className="ml-3 text-sm text-slate-400">Loading features...</span>
            </div>
          ) : availableFeatures.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 space-y-3">
              <p className="text-sm font-medium">No features yet.</p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-all"
              >
                <FiPlus size={13} /> Create your first feature
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableFeatures.map(feature => {
                const selected = selectedIds.has(feature.id);
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
                      selected
                        ? 'border-sky-500 bg-sky-50 shadow-sm shadow-sky-100'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    {/* Checkmark badge */}
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected ? 'bg-sky-500 border-sky-500' : 'border-slate-200'
                    }`}>
                      {selected && <FiCheck className="text-white" size={11} />}
                    </div>
                    <p className="font-bold text-sm text-slate-900 pr-6 leading-snug">{feature.name}</p>
                    {feature.slug && (
                      <span className="inline-block mt-1 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {feature.slug}
                      </span>
                    )}
                    {feature.description && (
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{feature.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Description Editor */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Detailed Description</label>
          <TiptapEditor
            value={formData.description || ''}
            onChange={(html) => setFormData({ ...formData, description: html })}
            placeholder="Describe the product value proposition in detail..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
          >
            {loading ? 'Processing...' : initialData?.slug ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
