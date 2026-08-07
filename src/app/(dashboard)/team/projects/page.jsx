'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiFolder, FiSearch, FiLoader, FiRefreshCw, FiX
} from 'react-icons/fi';

export default function TeamProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/projects');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    if (!matchesStatus) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.user_name?.toLowerCase().includes(q) ||
      p.user_email?.toLowerCase().includes(q) ||
      p.product_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Projects</h1>
          <p className="text-xs text-slate-500">Manage project inquiries, billing, and status</p>
        </div>

        <button
          onClick={fetchProjects}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={14} />
          Refresh
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'working', label: 'Working' },
            { id: 'ready', label: 'Ready' },
            { id: 'ontest', label: 'Testing' },
            { id: 'approved', label: 'Approved' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search project, customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-7 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <FiX size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FiLoader className="animate-spin mx-auto text-primary" size={24} />
            <p className="text-xs">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-12 text-center space-y-2 px-4">
            <FiFolder className="mx-auto text-slate-300" size={28} />
            <p className="font-semibold text-slate-700 text-sm">No projects found</p>
            <p className="text-xs text-slate-500">No project records matching filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Project Title</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <Link href={`/team/projects/${p.id}`} className="hover:text-primary">
                        {p.title}
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      <span className="font-semibold block">{p.user_name || 'Customer'}</span>
                      <span className="text-[11px] text-slate-400">{p.user_email}</span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {p.product_name || 'Custom'}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded border border-slate-200 text-[10px] font-semibold uppercase bg-slate-50 text-slate-700">
                        {p.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/team/projects/${p.id}`}
                        className="px-3 py-1 border border-slate-200 hover:bg-white text-slate-700 rounded font-semibold text-[11px] inline-block"
                      >
                        Workspace →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
