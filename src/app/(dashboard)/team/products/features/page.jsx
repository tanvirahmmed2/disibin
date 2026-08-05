'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX,
  FiPackage, FiTag, FiChevronDown, FiChevronUp, FiLoader,
  FiArrowLeft
} from 'react-icons/fi';
import Link from 'next/link';

const EMPTY_FORM = { name: '', description: '' };

/* ── Inline Feature Row ────────────────────────────── */
function FeatureItem({ feature, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(feature.name);
  const [description, setDescription] = useState(feature.description || '');
  const [saving, setSaving] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const nameRef = useRef(null);

  const startEdit = () => {
    setName(feature.name);
    setDescription(feature.description || '');
    setEditing(true);
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    setEditing(false);
    setName(feature.name);
    setDescription(feature.description || '');
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Feature name is required'); return; }
    setSaving(true);
    try {
      const res = await axios.put(`/api/team/product/features/${feature.id}`, {
        name: name.trim(),
        description: description.trim() || null,
      });
      if (res.data.success) {
        toast.success('Feature updated');
        onUpdate(res.data.data);
        setEditing(false);
      } else {
        toast.error(res.data.message || 'Failed to update feature');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${feature.name}"? This removes it from all products.`)) return;
    try {
      const res = await axios.delete(`/api/team/product/features/${feature.id}`);
      if (res.data.success) {
        toast.success('Feature deleted');
        onDelete(feature.id);
      } else {
        toast.error(res.data.message || 'Delete failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 p-4 transition-all hover:border-slate-300 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {editing ? (
          <div className="flex-1 space-y-2">
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') cancelEdit(); }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none text-sm font-semibold"
              placeholder="Feature name"
            />
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') cancelEdit(); }}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none text-xs text-slate-600"
              placeholder="Description (optional)"
            />
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm">{feature.name}</span>
              {feature.slug && (
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {feature.slug}
                </span>
              )}
              {feature.product_count > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowProducts(!showProducts)}
                  className="text-xs text-sky-600 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-full font-semibold transition-colors flex items-center gap-1"
                >
                  <FiPackage size={11} />
                  {feature.product_count} product{feature.product_count !== 1 ? 's' : ''}
                  {showProducts ? <FiChevronUp size={11} /> : <FiChevronDown size={11} />}
                </button>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                  Unused
                </span>
              )}
            </div>
            {feature.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{feature.description}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 disabled:opacity-50"
              >
                {saving ? <FiLoader size={12} className="animate-spin" /> : <FiCheck size={12} />}
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startEdit}
                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                title="Edit Feature"
              >
                <FiEdit2 size={15} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete Feature"
              >
                <FiTrash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {showProducts && !editing && feature.products?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">Tagged Products:</span>
          <div className="flex flex-wrap gap-1.5">
            {feature.products.map(p => (
              <Link
                key={p.id}
                href={`/team/products/${p.slug}`}
                className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 px-2.5 py-1 rounded-md font-medium transition-colors"
              >
                <FiPackage size={10} /> {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Features Page ────────────────────────────── */
const FeaturesPage = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/product/features');
      if (res.data.success) setFeatures(res.data.data);
    } catch {
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setShowAdd(true);
    setForm(EMPTY_FORM);
    setTimeout(() => nameInputRef.current?.focus(), 50);
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
        toast.success('Feature created');
        setFeatures([res.data.data, ...features]);
        setForm(EMPTY_FORM);
        setShowAdd(false);
      } else {
        toast.error(res.data.message || 'Failed to create feature');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = (updated) => {
    setFeatures(features.map(f => f.id === updated.id ? { ...f, ...updated } : f));
  };

  const handleDelete = (id) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const filteredFeatures = features.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 w-full space-y-6">
      <Toaster position="top-center" />

      {/* Header Bar */}
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
              <FiTag className="text-sky-500" /> Features
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">Manage feature tags used across products</p>
          </div>
        </div>

        <button
          onClick={showAdd ? () => setShowAdd(false) : handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-sky-600 transition-all shadow-md shrink-0"
        >
          {showAdd ? <FiX size={14} /> : <FiPlus size={14} />}
          {showAdd ? 'Cancel' : 'Add Feature'}
        </button>
      </div>

      {/* Quick Add Form Panel */}
      {showAdd && (
        <form onSubmit={handleCreate} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">New Feature Tag</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Feature name (e.g. 24/7 Support) *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500 outline-none text-xs font-semibold"
            />
            <input
              type="text"
              placeholder="Short description (optional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-sky-500 outline-none text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-all flex items-center gap-1 disabled:opacity-50"
            >
              {submitting ? <FiLoader size={12} className="animate-spin" /> : <FiCheck size={12} />}
              {submitting ? 'Creating...' : 'Save Feature'}
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          type="text"
          placeholder="Search features..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
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

      {/* Features List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-xs font-semibold gap-2">
          <FiLoader size={16} className="animate-spin text-sky-500" />
          <span>Loading features...</span>
        </div>
      ) : filteredFeatures.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
          <FiTag size={32} className="mx-auto mb-2 opacity-40" />
          <p className="font-bold text-slate-600 text-sm">
            {search ? `No features match "${search}"` : 'No features created yet'}
          </p>
          {!search && (
            <button
              onClick={handleOpenAdd}
              className="mt-3 inline-flex items-center gap-1 text-xs text-sky-600 font-bold hover:underline"
            >
              <FiPlus size={13} /> Create your first feature
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredFeatures.map(feature => (
            <FeatureItem
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
