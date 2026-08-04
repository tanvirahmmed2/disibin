'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiBriefcase, FiPlus, FiEdit2, FiTrash2, FiSearch, FiX,
  FiMapPin, FiClock, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import CareerModal from '@/component/forms/CareerModal';
import DeleteCareerModal from '@/component/forms/DeleteCareerModal';

const CareerManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // job | null
  const [deleteTarget, setDeleteTarget] = useState(null); // job | null
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      // ?all=true to fetch both published and unpublished jobs
      const res = await axios.get('/api/career?all=true');
      if (res.data.success) setJobs(res.data.data);
    } catch {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleUpdateSuccess = (updated) => {
    setJobs((prev) =>
      prev.map((j) => (j.job_id === updated.job_id ? updated : j))
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`/api/career?id=${deleteTarget.job_id}`);
      if (res.data.success) {
        setJobs((prev) => prev.filter((j) => j.job_id !== deleteTarget.job_id));
        toast.success('Job listing deleted');
        setDeleteTarget(null);
      }
    } catch {
      toast.error('Failed to delete job listing');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Derived values
  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter((j) => j.is_published).length;
  const draftJobs = totalJobs - publishedJobs;

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && j.is_published) ||
      (filterStatus === 'draft' && !j.is_published);
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <FiBriefcase className="text-violet-600" size={18} />
            </span>
            Career Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage job listings and applications</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <FiPlus size={16} /> Add Job
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <FiBriefcase className="text-violet-600" size={20} />, label: 'Total Listings', value: totalJobs, bg: 'bg-violet-50' },
          { icon: <FiCheckCircle className="text-emerald-600" size={20} />, label: 'Published', value: publishedJobs, bg: 'bg-emerald-50' },
          { icon: <FiXCircle className="text-amber-600" size={20} />, label: 'Drafts', value: draftJobs, bg: 'bg-amber-50' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
            <FiSearch className="text-slate-400 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search title or location..."
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Type / Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading jobs...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiBriefcase size={32} className="text-slate-200" />
                      <span className="text-sm">No jobs found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((j) => (
                  <tr key={j.job_id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{j.title}</div>
                      <div className="text-xs text-slate-400">{j.compensation || 'No compensation specified'}</div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={14} className="text-slate-400" />
                        {j.location}
                      </div>
                    </td>

                    {/* Type / Level */}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{j.job_type}</span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{j.level}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {j.is_published ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600">
                          <FiCheckCircle size={11} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500">
                          <FiClock size={11} /> Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditTarget(j)}
                          title="Edit Job"
                          className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(j)}
                          title="Delete Job"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <FiTrash2 size={15} />
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

      {/* Modals */}
      <CareerModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      <CareerModal
        isOpen={!!editTarget}
        initialData={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={handleUpdateSuccess}
      />

      <DeleteCareerModal
        isOpen={!!deleteTarget}
        job={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default CareerManagement;
