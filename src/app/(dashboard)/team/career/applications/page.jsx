'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiUsers, FiBriefcase, FiFileText, FiDownload,
  FiCheckCircle, FiXCircle, FiClock, FiTrash2,
  FiLoader, FiRefreshCw, FiSearch, FiExternalLink, FiUserCheck
} from 'react-icons/fi';

export default function TeamCareerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/public/career/apply');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch {
      toast.error('Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const res = await axios.patch('/api/public/career/apply', { appId, status: newStatus });
      if (res.data.success) {
        toast.success(`Candidate status updated to ${newStatus}`);
        setApplications(prev => prev.map(a => a.app_id === appId ? { ...a, status: newStatus } : a));
      } else {
        toast.error(res.data.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update candidate status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Delete this job application record?')) return;

    setDeletingId(appId);
    try {
      const res = await axios.delete(`/api/public/career/apply?id=${appId}`);
      if (res.data.success) {
        toast.success('Application deleted');
        setApplications(prev => prev.filter(a => a.app_id !== appId));
      } else {
        toast.error(res.data.message || 'Failed to delete application');
      }
    } catch {
      toast.error('Failed to delete application');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredApps = applications.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    if (!matchesStatus) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      a.full_name?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.job_title?.toLowerCase().includes(term) ||
      a.cover_letter?.toLowerCase().includes(term)
    );
  });

  const totalCount = applications.length;
  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length;
  const hiredCount = applications.filter(a => a.status === 'hired').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FiUsers size={20} />
            </span>
            Job Applicants & Resumes
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Review applicant resumes, cover letters, and manage hiring pipeline status
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/team/career"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition-all"
          >
            ← Manage Vacancies
          </Link>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs"
            title="Refresh List"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          </button>
        </div>
      </div>

      {/* Metric Badges & Filter Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/70 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Applicants', count: totalCount },
            { id: 'applied', label: 'New Applied', count: appliedCount },
            { id: 'interviewing', label: 'Interviewing', count: interviewingCount },
            { id: 'hired', label: 'Hired', count: hiredCount },
            { id: 'rejected', label: 'Rejected', count: rejectedCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full ${
                filterStatus === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search candidate name, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-style text-xs py-1.5"
          />
        </div>
      </div>

      {/* Applications List Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading candidate applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiUsers className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No job applications found</p>
            <p className="text-xs text-slate-500">There are no candidate applications matching your search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => (
              <div key={app.app_id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{app.full_name}</h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        app.status === 'hired'
                          ? 'bg-primary/20 text-primary'
                          : app.status === 'interviewing'
                          ? 'bg-primary/20 text-primary-dark'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-secondary/20 text-secondary'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <a href={`mailto:${app.email}`} className="font-bold text-primary hover:underline">{app.email}</a>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">Applied for: {app.job_title || 'General Vacancy'}</span>
                      <span>·</span>
                      <span>{new Date(app.created_at).toLocaleString()}</span>
                    </p>
                  </div>

                  {/* Actions & Resume Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-primary text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <FiExternalLink size={13} /> View Resume
                    </a>

                    {/* Status Dropdown Select */}
                    <select
                      value={app.status}
                      disabled={updatingId === app.app_id}
                      onChange={(e) => handleStatusChange(app.app_id, e.target.value)}
                      className="input-style text-xs font-bold cursor-pointer py-2"
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handleDelete(app.app_id)}
                      disabled={deletingId === app.app_id}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-40"
                      title="Delete Application"
                    >
                      {deletingId === app.app_id ? <FiLoader className="animate-spin" size={15} /> : <FiTrash2 size={15} />}
                    </button>
                  </div>
                </div>

                {/* Cover Letter */}
                {app.cover_letter && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <p className="font-bold text-slate-700 uppercase tracking-wider">Cover Letter / Note</p>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{app.cover_letter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
