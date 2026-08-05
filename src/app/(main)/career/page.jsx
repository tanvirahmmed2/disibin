'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiBriefcase, FiMapPin, FiClock, FiCheckCircle,
  FiPaperclip, FiSend, FiX, FiLoader, FiChevronDown
} from 'react-icons/fi';

export default function PublicCareerPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submittingApp, setSubmittingApp] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/public/career');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch {
      toast.error('Failed to load career openings');
    } finally {
      setLoading(false);
    }
  };

  const toggleJob = (id) => {
    setExpandedJobId(prev => prev === id ? null : id);
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setApplicantName('');
    setApplicantEmail('');
    setCoverLetter('');
    setResumeFile(null);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) {
      return toast.error('Full name and email address are required');
    }
    if (!resumeFile) {
      return toast.error('Please attach your resume file (PDF/DOCX)');
    }

    setSubmittingApp(true);
    const formData = new FormData();
    formData.append('job_id', selectedJob.job_id);
    formData.append('full_name', applicantName.trim());
    formData.append('email', applicantEmail.trim());
    formData.append('cover_letter', coverLetter.trim());
    formData.append('resume', resumeFile);

    try {
      const res = await axios.post('/api/public/career/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Application submitted successfully!');
        setSelectedJob(null);
      } else {
        toast.error(res.data.message || 'Application submission failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit job application');
    } finally {
      setSubmittingApp(false);
    }
  };

  const formatList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  return (
    <div className="w-full min-h-screen flex flex-col pt-24 pb-16 px-4 max-w-5xl mx-auto space-y-12">
      <Toaster position="top-center" />

      {/* Hero Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-100 text-xs font-bold uppercase tracking-wider">
          <FiBriefcase size={14} /> Careers at Disibin
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Shape the Future of Digital Innovation
        </h1>
        <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed">
          We are a high-impact studio building world-class platforms. Join our dedicated team of engineers, designers, and creators.
        </p>
      </section>

      {/* Open Positions List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Open Positions</h2>

        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-sky-500" size={28} />
            <p className="text-sm font-medium">Loading career openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center text-slate-500 space-y-2">
            <FiBriefcase size={36} className="mx-auto text-slate-300" />
            <h3 className="text-lg font-bold text-slate-800">No Open Positions Currently</h3>
            <p className="text-xs text-slate-400">There are no open job roles at this time. Please check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isExpanded = expandedJobId === job.job_id;
              const responsibilities = formatList(job.responsibilities);
              const skills = formatList(job.skills);
              const niceToHave = formatList(job.nice_to_have);

              return (
                <div
                  key={job.job_id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-sky-200"
                >
                  {/* Job Header */}
                  <div
                    onClick={() => toggleJob(job.job_id)}
                    className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-2 min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 truncate">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full">{job.job_type}</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">{job.level}</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1">
                          <FiMapPin size={12} /> {job.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      {job.compensation && (
                        <span className="text-sm font-bold text-slate-800">{job.compensation}</span>
                      )}
                      <div className={`p-2 rounded-xl bg-slate-100 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-sky-100 text-sky-600' : ''}`}>
                        <FiChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Role Details */}
                  {isExpanded && (
                    <div className="p-6 border-t border-slate-100 space-y-6 bg-slate-50/40 text-sm">
                      {job.description && (
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">About the Role</h4>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                        </div>
                      )}

                      {responsibilities.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Key Responsibilities</h4>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}

                      {skills.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((s, i) => (
                              <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {niceToHave.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Nice to Have</h4>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {niceToHave.map((n, i) => <li key={i}>{n}</li>)}
                          </ul>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => openApplyModal(job)}
                          className="px-6 py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center gap-2"
                        >
                          <FiSend size={14} /> Apply for this Position
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Application Submission Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FiBriefcase className="text-sky-500" size={18} />
                  Apply for {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-400">{selectedJob.job_type} · {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  placeholder="E.g. Sarah Connor"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={e => setApplicantEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resume Document (PDF/DOCX) *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => setResumeFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200"
                  >
                    <FiPaperclip size={14} />
                    {resumeFile ? 'Change Resume' : 'Attach Resume'}
                  </button>
                  {resumeFile && (
                    <span className="text-xs text-slate-600 truncate max-w-xs font-semibold">
                      {resumeFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cover Letter / Introduction (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself and describe why you are a great fit for this role..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
                >
                  {submittingApp ? <FiLoader className="animate-spin" size={14} /> : <FiSend size={14} />}
                  {submittingApp ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
