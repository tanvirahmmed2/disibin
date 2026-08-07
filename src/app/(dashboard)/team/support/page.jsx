'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiLifeBuoy, FiSearch, FiCheckCircle, FiClock,
  FiTrash2, FiMessageSquare, FiLoader, FiX, FiRefreshCw
} from 'react-icons/fi';

export default function SupportsManagement() {
  const router = useRouter();
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchSupports();
  }, []);

  const fetchSupports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/support');
      if (res.data.success) {
        setSupports(res.data.data);
      }
    } catch {
      toast.error('Failed to load support requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this support request? This cannot be undone.')) return;

    setDeleting(id);
    try {
      const res = await axios.delete(`/api/team/support?id=${id}`);
      if (res.data.success) {
        toast.success('Support request deleted');
        setSupports(prev => prev.filter(s => s.id !== id));
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete support request');
    } finally {
      setDeleting(null);
    }
  };

  // Metrics
  const totalCount = supports.length;
  const pendingCount = supports.filter(s => s.status === 'pending').length;
  const repliedCount = supports.filter(s => s.status === 'replied').length;

  const filteredSupports = supports.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    if (!matchesFilter) return false;

    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.subject?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <FiLifeBuoy size={20} />
            </span>
            Support Inbox
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Manage incoming contact form submissions and support inquiries
          </p>
        </div>

        <button
          onClick={fetchSupports}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-sm self-start sm:self-auto shadow-sm"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          Refresh Inbox
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FiLifeBuoy size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inquiries</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <FiClock size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Reply</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Replied</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : repliedCount}</p>
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-style pl-10 pr-9 text-sm py-2"
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

          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl w-full sm:w-auto">
            {[
              { id: 'all', label: 'All', count: totalCount },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'replied', label: 'Replied', count: repliedCount },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-300/50 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-secondary" size={28} />
            <p className="text-sm font-medium">Loading support inquiries...</p>
          </div>
        ) : filteredSupports.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FiLifeBuoy size={32} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-slate-800 text-base">No support requests found</h3>
              <p className="text-xs text-slate-500">
                {search || filter !== 'all'
                  ? 'No inquiries match your filter criteria.'
                  : 'All incoming customer messages will be displayed here.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Sender Info</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSupports.map((item) => {
                  const isPending = item.status === 'pending';
                  return (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/team/support/${item.id}`)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{item.email}</div>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-semibold text-slate-800 line-clamp-1">{item.subject || 'No Subject'}</p>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {item.description?.replace(/<[^>]+>/g, '') || ''}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isPending
                            ? 'bg-secondary/10 text-secondary border border-secondary/20'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          {isPending ? <FiClock size={11} /> : <FiCheckCircle size={11} />}
                          {isPending ? 'Pending' : 'Replied'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right space-x-1" onClick={e => e.stopPropagation()}>
                        <Link
                          href={`/team/support/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-primary text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <FiMessageSquare size={13} /> {isPending ? 'Reply' : 'View Details'}
                        </Link>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          disabled={deleting === item.id}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                          title="Delete Request"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

