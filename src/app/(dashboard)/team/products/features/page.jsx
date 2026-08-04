'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX,
  FiPackage, FiTag, FiChevronDown, FiChevronUp, FiLoader,
  FiArrowLeft,
} from 'react-icons/fi';
import Link from 'next/link';

/* ─────────────────────────────────────────────────
   EMPTY FORM STATE
───────────────────────────────────────────────── */
const EMPTY = { name: '', description: '' };

/* ─────────────────────────────────────────────────
   INLINE EDITABLE ROW
───────────────────────────────────────────────── */
function FeatureRow({ feature, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: feature.name, description: feature.description || '' });
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const nameRef = useRef(null);

  const startEdit = () => {
    setForm({ name: feature.name, description: feature.description || '' });
    setEditing(true);
    setTimeout(() => nameRef.current?.focus(), 60);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({ name: feature.name, description: feature.description || '' });
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Feature name is required'); return; }
    setSaving(true);
    try {
      const res = await axios.put(`/api/team/product/features/${feature.id}`, {
        name: form.name.trim(),
        description: form.description.trim() || null,
      });
      if (res.data.success) {
        toast.success('Feature updated');
        onUpdate({ ...feature, name: form.name.trim(), description: form.description.trim() || null });
        setEditing(false);
      } else {
        toast.error(res.data.message || 'Failed to update');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete feature "${feature.name}"?\n\nThis will remove it from all products that use it.`)) return;
    try {
      const res = await axios.delete(`/api/team/product/features/${feature.id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        onDelete(feature.id);
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Feature icon badge */}
        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 mt-0.5">
          <FiTag className="text-sky-500" size={17} />
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                ref={nameRef}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancelEdit(); }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm font-semibold text-slate-900 transition-all"
                placeholder="Feature name"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm text-slate-600 resize-none transition-all"
                placeholder="Optional description..."
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900 text-sm leading-snug">{feature.name}</p>
                {feature.slug && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                    {feature.slug}
                  </span>
                )}
              </div>
              {feature.description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-1">{feature.description}</p>
              )}
            </>
          )}

          {/* Products usage badge */}
          {!editing && feature.product_count > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 inline-flex items-center gap-1 text-xs text-sky-600 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-full font-semibold transition-colors"
            >
              <FiPackage size={11} />
              {feature.product_count} product{feature.product_count !== 1 ? 's' : ''}
              {expanded ? <FiChevronUp size={11} /> : <FiChevronDown size={11} />}
            </button>
          )}
          {!editing && feature.product_count === 0 && (
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full font-medium">
              Not used in any product
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {editing ? (
            <>
              <button
                onClick={save}
                disabled={saving}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50"
                title="Save"
              >
                {saving ? <FiLoader size={16} className="animate-spin" /> : <FiCheck size={16} />}
              </button>
              <button
                onClick={cancelEdit}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
                title="Cancel"
              >
                <FiX size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startEdit}
                className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all"
                title="Edit feature"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete feature"
              >
                <FiTrash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded product list */}
      {expanded && !editing && feature.products?.length > 0 && (
        <div className="px-5 pb-4 pt-0 border-t border-slate-50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-3">Used in</p>
          <div className="flex flex-wrap gap-2">
            {feature.products.map((p) => (
              <Link
                key={p.id}
                href={`/team/products/${p.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-600 border border-slate-100 hover:border-sky-100 rounded-xl text-xs font-semibold transition-all"
              >
                <FiPackage size={11} /> {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────── */
const FeaturesPage = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchFeatures(); }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/product/features');
      if (res.data.success) setFeatures(res.data.data);
    } catch {
      toast.error('Failed to fetch features');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Feature name is required'); return; }
    setSubmitting(true);
    try {
      const res = await axios.post('/api/team/product/features', {
        name: form.name.trim(),
        description: form.description.trim() || null,
      });
      if (res.data.success) {
        toast.success('Feature created successfully');
        setFeatures([...features, { ...res.data.data, product_count: 0, products: [] }]);
        setForm(EMPTY);
        setShowForm(false);
      } else {
        toast.error(res.data.message || 'Failed to create feature');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = (updated) => {
    setFeatures(features.map((f) => (f.id === updated.id ? { ...f, ...updated } : f)));
  };

  const handleDelete = (id) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const filtered = features.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* Stats */
  const totalProducts = features.reduce((sum, f) => sum + (f.product_count || 0), 0);
  const unusedCount = features.filter((f) => f.product_count === 0).length;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/team/products"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            title="Back to Products"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FiTag className="text-sky-500" /> Product Features
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage reusable feature tags used across products
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setForm(EMPTY); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-slate-200 shrink-0"
        >
          {showForm ? <FiX size={16} /> : <FiPlus size={16} />}
          {showForm ? 'Cancel' : 'New Feature'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Features', value: features.length, color: 'bg-sky-50 text-sky-700 border-sky-100' },
          { label: 'Product Usages', value: totalProducts, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Unused', value: unusedCount, color: 'bg-amber-50 text-amber-700 border-amber-100' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border px-5 py-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create Form Panel */}
      {showForm && (
        <div className="bg-white border border-sky-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-sky-50/40 flex items-center gap-2">
            <FiPlus className="text-sky-500" size={16} />
            <h2 className="font-bold text-slate-900 text-sm">Create New Feature</h2>
          </div>
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Feature Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm font-semibold transition-all"
                  placeholder="e.g. 24/7 Support"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-sm transition-all"
                  placeholder="Brief explanation of this feature"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(EMPTY); }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 text-sm transition-all disabled:opacity-60 flex items-center gap-2 shadow-md shadow-sky-500/20"
              >
                {submitting ? (
                  <><FiLoader size={14} className="animate-spin" /> Creating...</>
                ) : (
                  <><FiCheck size={14} /> Create Feature</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search bar */}
      <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
        <FiSearch className="text-slate-400 shrink-0" size={16} />
        <input
          type="text"
          placeholder="Search features by name or description..."
          className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-700 transition-colors">
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* Feature List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <FiLoader size={32} className="animate-spin text-sky-400" />
          <p className="text-sm font-medium">Loading features...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
          <FiTag size={40} className="mx-auto mb-3 opacity-50" />
          <p className="font-bold text-slate-500">
            {searchTerm ? `No features match "${searchTerm}"` : 'No features yet'}
          </p>
          {!searchTerm && (
            <p className="text-sm mt-1">Create your first feature to start tagging products.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((feature) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturesPage;
