'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiShield, FiSearch, FiRefreshCw, FiLoader,
  FiCheckCircle, FiXCircle, FiClock, FiX
} from 'react-icons/fi';

export default function TeamLoginLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/team-login-logs');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch {
      toast.error('Failed to load team login logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    if (!matchesStatus) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.team_name?.toLowerCase().includes(q) ||
      l.team_email?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q)
    );
  });

  const totalCount = logs.length;
  const successCount = logs.filter(l => l.status === 'success').length;
  const failCount = logs.filter(l => l.status === 'fail').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FiShield size={20} />
            </span>
            Team Staff Login Audit Logs
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Audit history of internal team member authentication events and security access logs
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

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Logins', count: totalCount },
            { id: 'success', label: 'Successful', count: successCount },
            { id: 'fail', label: 'Failed Attempts', count: failCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full ${
                statusFilter === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search staff name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-style text-xs py-2"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading staff login audit trail...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiShield className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No login logs found</p>
            <p className="text-xs text-slate-500">There are no team authentication records matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Event Description</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-xs">{log.team_name || 'Staff Member'}</p>
                      <p className="text-[10px] text-slate-400">{log.team_email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-700">
                        {log.team_role || 'Staff'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        log.status === 'success'
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {log.status === 'success' ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                        {log.status === 'success' ? 'Successful' : 'Failed'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      {log.description || 'Login attempt'}
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
