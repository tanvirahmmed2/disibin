'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiFolder, FiSearch, FiMessageSquare, FiClock,
  FiLoader, FiRefreshCw, FiUser, FiExternalLink, FiDollarSign
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
      toast.error('Failed to load customer projects');
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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
              <FiFolder size={20} />
            </span>
            Customer Projects & Inquiries Workspace
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Manage customer project proposals, live discussion, status progression, and manual purchases
          </p>
        </div>

        <button
          onClick={fetchProjects}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs self-start sm:self-auto shadow-sm"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          Refresh Projects
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/70 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'pending', label: 'Pending' },
            { id: 'working', label: 'Working' },
            { id: 'ready', label: 'Ready' },
            { id: 'ontest', label: 'Testing' },
            { id: 'approved', label: 'Approved' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search project title, client name/email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>
      </div>

      {/* Main Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-sky-500" size={28} />
            <p className="text-sm font-medium">Loading customer projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiFolder className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No customer projects found</p>
            <p className="text-xs text-slate-500">There are no project inquiries matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Project Title</th>
                  <th className="px-6 py-4">Customer Account</th>
                  <th className="px-6 py-4">Base Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/team/projects/${p.id}`} className="font-extrabold text-slate-900 hover:text-sky-600 transition-colors">
                        {p.title}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-xs">{p.user_name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{p.user_email}</p>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      {p.product_name || 'Custom Solution'}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        p.status === 'approved' || p.status === 'ready'
                          ? 'bg-emerald-100 text-emerald-700'
                          : p.status === 'working' || p.status === 'ontest' || p.status === 'fixing'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/team/projects/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Open Workspace →
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
