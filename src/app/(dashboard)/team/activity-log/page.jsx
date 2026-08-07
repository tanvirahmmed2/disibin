'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiActivity, FiSearch, FiRefreshCw, FiLoader,
  FiUser, FiCalendar, FiClock, FiX
} from 'react-icons/fi';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/activity-log');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch {
      toast.error('Failed to load system activity logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q) ||
      l.team_name?.toLowerCase().includes(q) ||
      l.team_email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/100/10 text-purple-600 flex items-center justify-center shrink-0">
              <FiActivity size={20} />
            </span>
            System Activity Audit Logs
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Complete audit trail of operational system events, content changes, and staff actions
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs self-start sm:self-auto shadow-sm"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          Refresh Logs
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search action, description, staff..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-style pl-10 pr-9 text-sm py-2"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Showing {filteredLogs.length} of {logs.length} activity records
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading system audit trail...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiActivity className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No activity logs found</p>
            <p className="text-xs text-slate-500">There are no operational activity records matching your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Action Event</th>
                  <th className="px-6 py-4">Performed By</th>
                  <th className="px-6 py-4">Event Description</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-extrabold uppercase bg-primary/10 text-purple-700 border border-purple-100">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {log.team_name ? (
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 text-xs">{log.team_name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{log.team_role || 'Staff'} · {log.team_email}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">System / Public</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-700 max-w-md">
                      {log.description || 'No description provided'}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400 text-right font-medium">
                      <span className="inline-flex items-center gap-1">
                        <FiClock size={12} />
                        {new Date(log.created_at).toLocaleString()}
                      </span>
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
