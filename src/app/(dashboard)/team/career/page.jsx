'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
  FiBriefcase, FiPlus, FiEdit2, FiTrash2, FiEye,
  FiEyeOff, FiMapPin, FiLoader, FiX, FiRefreshCw, FiCheckCircle
} from 'react-icons/fi';

export default function TeamCareerPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState({
    title: '',
    location: 'Remote',
    job_type: 'Full-time',
    level: 'Mid-Level',
    compensation: '',
    description: '',
    responsibilities: '',
    skills: '',
    nice_to_have: '',
    is_published: true
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/public/career?all=true');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch {
      toast.error('Failed to load career postings');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingJob(null);
    setForm({
      title: '',
      location: 'Remote',
      job_type: 'Full-time',
      level: 'Mid-Level',
      compensation: '',
      description: '',
      responsibilities: '',
      skills: '',
      nice_to_have: '',
      is_published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || '',
      location: job.location || 'Remote',
      job_type: job.job_type || 'Full-time',
      level: job.level || 'Mid-Level',
      compensation: job.compensation || '',
      description: job.description || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join(', ') : (job.responsibilities || ''),
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || ''),
      nice_to_have: Array.isArray(job.nice_to_have) ? job.nice_to_have.join(', ') : (job.nice_to_have || ''),
      is_published: job.is_published !== undefined ? job.is_published : true
    });
    setIsModalOpen(true);
  };

  const togglePublished = async (job) => {
    try {
      const res = await axios.patch('/api/public/career', {
        jobId: job.job_id,
        is_published: !job.is_published
      });
      if (res.data.success) {
        toast.success(`Job ${!job.is_published ? 'published' : 'unpublished'}`);
        setJobs(prev => prev.map(j => j.job_id === job.job_id ? res.data.data : j));
      }
    } catch {
      toast.error('Failed to toggle publish status');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Job title is required');

    setSaving(true);
    try {
      if (editingJob) {
        const res = await axios.patch('/api/public/career', { jobId: editingJob.job_id, ...form });
        if (res.data.success) {
          toast.success('Job posting updated');
          setJobs(prev => prev.map(j => j.job_id === editingJob.job_id ? res.data.data : j));
          setIsModalOpen(false);
        } else {
          toast.error(res.data.message || 'Failed to update job');
        }
      } else {
        const res = await axios.post('/api/public/career', form);
        if (res.data.success) {
          toast.success('Job posting created');
          setJobs(prev => [res.data.data, ...prev]);
          setIsModalOpen(false);
        } else {
          toast.error(res.data.message || 'Failed to create job');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving job posting');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete job posting "${job.title}"?`)) return;

    setDeletingId(job.job_id);
    try {
      const res = await axios.delete(`/api/public/career?id=${job.job_id}`);
      if (res.data.success) {
        toast.success('Job deleted');
        setJobs(prev => prev.filter(j => j.job_id !== job.job_id));
      } else {
        toast.error(res.data.message || 'Failed to delete job');
      }
    } catch {
      toast.error('Failed to delete job posting');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FiBriefcase size={20} />
            </span>
            Career Positions & Openings
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Manage job vacancies, specifications, requirements, and publishing status
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/team/career/applications"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition-all"
          >
            Review Candidates →
          </Link>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
          >
            <FiPlus size={16} />
            Create Job Vacancy
          </button>
        </div>
      </div>

      {/* Job Grid / List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading job vacancies...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <FiBriefcase className="mx-auto text-slate-300" size={32} />
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-slate-800 text-base">No career positions created</h3>
              <p className="text-xs text-slate-500">Click "Create Job Vacancy" to add your first job opening.</p>
            </div>
            <button
              onClick={openAddModal}
              className="text-xs text-primary font-bold hover:underline"
            >
              + Create First Job
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div key={job.job_id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 truncate">{job.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      job.is_published ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {job.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">{job.job_type}</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">{job.level}</span>
                    <span className="bg-primary/10 px-2.5 py-1 rounded-lg text-primary flex items-center gap-1">
                      <FiMapPin size={12} /> {job.location}
                    </span>
                    {job.compensation && (
                      <span className="bg-primary/10 px-2.5 py-1 rounded-lg text-primary font-bold">{job.compensation}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => togglePublished(job)}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    title={job.is_published ? 'Unpublish Job' : 'Publish Job'}
                  >
                    {job.is_published ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>

                  <button
                    onClick={() => openEditModal(job)}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    title="Edit Job"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(job)}
                    disabled={deletingId === job.job_id}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-40"
                    title="Delete Job"
                  >
                    {deletingId === job.job_id ? <FiLoader className="animate-spin" size={16} /> : <FiTrash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FiBriefcase className="text-primary" size={18} />
                {editingJob ? 'Edit Job Opening' : 'Create New Job Vacancy'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="E.g. Senior Frontend Engineer"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="Remote / On-site"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Job Type *
                  </label>
                  <select
                    value={form.job_type}
                    onChange={e => setForm({ ...form, job_type: e.target.value })}
                    className="input-style text-sm py-2"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Experience Level *
                  </label>
                  <select
                    value={form.level}
                    onChange={e => setForm({ ...form, level: e.target.value })}
                    className="input-style text-sm py-2"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Compensation / Salary Range
                </label>
                <input
                  type="text"
                  value={form.compensation}
                  onChange={e => setForm({ ...form, compensation: e.target.value })}
                  placeholder="E.g. $80,000 - $110,000 / year"
                  className="input-style text-sm py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide an overview of the position, mission, and team structure..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Responsibilities (Comma-separated or lines)
                </label>
                <input
                  type="text"
                  value={form.responsibilities}
                  onChange={e => setForm({ ...form, responsibilities: e.target.value })}
                  placeholder="Lead engineering team, Manage Next.js architecture, Conduct code reviews"
                  className="input-style text-sm py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={e => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Next.js, Node.js, PostgreSQL, TailwindCSS"
                  className="input-style text-sm py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nice to Have (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.nice_to_have}
                  onChange={e => setForm({ ...form, nice_to_have: e.target.value })}
                  placeholder="Docker, Cloudinary, Brevo API, Microservices"
                  className="input-style text-sm py-2"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={form.is_published}
                  onChange={e => setForm({ ...form, is_published: e.target.checked })}
                  className="input-style"
                />
                <label htmlFor="is_published" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Publish vacancy immediately on career page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
                >
                  {saving ? <FiLoader className="animate-spin" size={14} /> : null}
                  {saving ? 'Saving...' : editingJob ? 'Update Vacancy' : 'Create Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
