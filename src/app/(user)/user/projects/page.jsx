'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiFolder, FiPlus, FiMessageSquare, FiClock,
  FiCheckCircle, FiLoader, FiX, FiRefreshCw, FiExternalLink
} from 'react-icons/fi';

export default function UserProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Project Form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [productId, setProductId] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchProducts();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/user/project');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch {
      toast.error('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/public/product');
      if (res.data.success) setProducts(res.data.data);
    } catch {}
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Project title is required');

    setSubmitting(true);
    try {
      const res = await axios.post('/api/user/project', {
        title: title.trim(),
        product_id: productId || null,
        initial_message: initialMessage.trim()
      });

      if (res.data.success) {
        toast.success('Project created successfully!');
        setTitle('');
        setProductId('');
        setInitialMessage('');
        setShowForm(false);
        fetchProjects();
      } else {
        toast.error(res.data.message || 'Failed to create project');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
              <FiFolder size={20} />
            </span>
            My Custom Projects & Services
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Collaborate directly with our technical team, review custom proposals, and manage payments
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 self-start sm:self-auto"
        >
          <FiPlus size={16} /> Start New Project
        </button>
      </div>

      {/* Create Project Form Drawer */}
      {showForm && (
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-lg space-y-4 animate-fade-down">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FiFolder className="text-sky-500" size={18} />
              Start New Project Inquiry
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
            >
              <FiX size={16} />
            </button>
          </div>

          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Title / Purpose *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g. Custom E-Commerce Platform Setup & Integration"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Base Product (Optional)
              </label>
              <select
                value={productId}
                onChange={e => setProductId(e.target.value)}
                className="input-style text-sm py-2"
              >
                <option value="">-- No specific base product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Requirements / Initial Message
              </label>
              <textarea
                rows={3}
                value={initialMessage}
                onChange={e => setInitialMessage(e.target.value)}
                placeholder="Describe your goals, requirements, desired timeline, or custom features..."
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
                disabled={submitting}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
              >
                {submitting ? <FiLoader className="animate-spin" size={14} /> : null}
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-sky-500" size={28} />
            <p className="text-sm font-medium">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiFolder className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No active projects found</p>
            <p className="text-xs text-slate-500">Click "Start New Project" to initiate custom service inquiries.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.map((p) => (
              <div key={p.id} className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/user/projects/${p.id}`} className="text-base font-extrabold text-slate-900 hover:text-sky-600 transition-colors truncate">
                      {p.title}
                    </Link>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      p.status === 'approved' || p.status === 'ready'
                        ? 'bg-emerald-100 text-emerald-700'
                        : p.status === 'working' || p.status === 'ontest' || p.status === 'fixing'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    {p.product_name && (
                      <span className="font-semibold text-slate-700">Base: {p.product_name}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiMessageSquare size={12} /> {p.message_count || 0} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={12} /> Updated {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                <Link
                  href={`/user/projects/${p.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 self-start sm:self-auto"
                >
                  Open Workspace →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
