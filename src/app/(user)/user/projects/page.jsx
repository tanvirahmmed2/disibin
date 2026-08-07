'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiFolder, FiPlus, FiMessageSquare, FiClock,
  FiLoader, FiX
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
      toast.error('Failed to load projects');
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
        toast.success('Project created!');
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
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <Toaster position="top-center" />

      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Projects</h1>
          <p className="text-xs text-slate-500">Collaborate with our team on custom projects</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <FiPlus size={15} /> New Project
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">Start New Project</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <FiX size={16} />
            </button>
          </div>

          <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="E.g. Custom Web App Development"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Product (Optional)</label>
              <select
                value={productId}
                onChange={e => setProductId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs"
              >
                <option value="">None</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Details / Requirements</label>
              <textarea
                rows={2}
                value={initialMessage}
                onChange={e => setInitialMessage(e.target.value)}
                placeholder="Describe project requirements..."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1"
              >
                {submitting ? <FiLoader className="animate-spin" size={13} /> : null}
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FiLoader className="animate-spin mx-auto text-primary" size={24} />
            <p className="text-xs">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center space-y-2 px-4">
            <FiFolder className="mx-auto text-slate-300" size={28} />
            <p className="font-semibold text-slate-700 text-sm">No projects found</p>
            <p className="text-xs text-slate-500">Click "New Project" to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.map((p) => (
              <div key={p.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/user/projects/${p.id}`} className="text-sm font-bold text-slate-800 hover:text-primary truncate">
                      {p.title}
                    </Link>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-slate-200 font-semibold uppercase bg-slate-50 text-slate-600">
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-3">
                    {p.product_name && <span>Base: {p.product_name}</span>}
                    <span>{p.message_count || 0} messages</span>
                    <span>Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                  </p>
                </div>

                <Link
                  href={`/user/projects/${p.id}`}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-semibold shrink-0"
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
