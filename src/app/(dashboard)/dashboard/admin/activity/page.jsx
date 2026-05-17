'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiActivity, FiSearch, FiX, FiUser, FiBox, FiBriefcase, FiTag
} from 'react-icons/fi';

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : '—';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/activity');
      if (res.data.success) setLogs(res.data.data);
    } catch {
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((l) => {
    const searchStr = `${l.user_name} ${l.action} ${l.entity_type} ${l.description || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const getEntityIcon = (type) => {
    switch (type) {
      case 'product': return <FiBox className="text-violet-500" />;
      case 'career': return <FiBriefcase className="text-emerald-500" />;
      case 'coupon': return <FiTag className="text-amber-500" />;
      default: return <FiActivity className="text-slate-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
            <FiActivity className="text-violet-600" size={18} />
          </span>
          Activity Log
        </h1>
        <p className="text-slate-500 text-sm mt-1">Audit trail of administrative actions</p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 max-w-md">
            <FiSearch className="text-slate-400 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading logs...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiActivity size={32} className="text-slate-200" />
                      <span className="text-sm">No logs found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-slate-400" />
                        <div>
                          <div className="font-bold text-slate-900">{l.user_name || 'System'}</div>
                          <div className="text-xs text-slate-400 capitalize">{l.user_role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                        l.action === 'CREATE' ? 'bg-emerald-50 text-emerald-600' :
                        l.action === 'UPDATE' ? 'bg-sky-50 text-sky-600' :
                        l.action === 'DELETE' ? 'bg-rose-50 text-rose-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {l.action}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        {getEntityIcon(l.entity_type)}
                        <span className="capitalize">{l.entity_type}</span>
                        {l.entity_id && <span className="text-xs text-slate-400">#{l.entity_id}</span>}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-slate-500 text-xs truncate" title={l.description || JSON.stringify(l.details)}>
                        {l.description || JSON.stringify(l.details) || '—'}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {fmtDate(l.created_at)}
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
};

export default ActivityLog;
