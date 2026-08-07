'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiTrash2
} from 'react-icons/fi';

export default function TeamReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = '/api/team/reports';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      const res = await axios.get(url);
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this issue report?')) return;
    try {
      const res = await axios.delete(`/api/team/reports?id=${id}`);
      if (res.data.success) {
        toast.success('Report deleted');
        setReports((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      toast.error('Failed to delete report');
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const repliedCount = reports.filter((r) => r.status === 'replied').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/100 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
            <FiAlertTriangle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Issue Reports Inbox</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and respond to bug submissions, vulnerabilities, and technical issue reports.
            </p>
          </div>
        </div>

        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm self-start md:self-auto"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reports</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{reports.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            {reports.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Pending Review</span>
            <h3 className="text-2xl font-extrabold text-secondary mt-1">{pendingCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
            <FiClock size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Replied / Resolved</span>
            <h3 className="text-2xl font-extrabold text-primary mt-1">{repliedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <FiCheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search report, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-style pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-slate-400 hidden sm:block" size={16} />
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {['all', 'pending', 'replied'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all flex-1 sm:flex-initial ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Submitted At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Loading issue reports...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No issue reports found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      {report.status === 'replied' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                          <FiCheckCircle size={12} />
                          Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">
                          <FiClock size={12} />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{report.name}</div>
                      <div className="text-xs text-slate-400">{report.email}</div>
                    </td>

                    <td className="px-6 py-4 max-w-xs truncate">
                      <span className="font-medium text-slate-800">{report.subject}</span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(report.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/team/reports/${report.id}`}
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title="View / Reply"
                        >
                          <FiEye size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Report"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
