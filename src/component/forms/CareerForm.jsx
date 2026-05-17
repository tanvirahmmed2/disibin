'use client';
import React, { useState, useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

/**
 * CareerForm
 * ----------
 * Form to create or edit a job listing.
 * Handles array fields for responsibilities, skills, and nice_to_have.
 *
 * Props
 *   initialData — job object (Edit mode) | null (Create mode)
 *   onSuccess   — (job) => void
 *   onCancel    — () => void
 */
const CareerForm = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    job_type: 'Full-time',
    level: 'Mid Level',
    compensation: '',
    description: '',
    responsibilities: [],
    skills: [],
    nice_to_have: [],
    is_published: true,
  });

  const [loading, setLoading] = useState(false);

  // Temporary inputs for array fields
  const [respInput, setRespInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [niceInput, setNiceInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        location: initialData.location || '',
        job_type: initialData.job_type || 'Full-time',
        level: initialData.level || 'Mid Level',
        compensation: initialData.compensation || '',
        description: initialData.description || '',
        responsibilities: initialData.responsibilities || [],
        skills: initialData.skills || [],
        nice_to_have: initialData.nice_to_have || [],
        is_published: initialData.is_published ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddArrayItem = (field, value, setInput) => {
    if (!value.trim()) return;
    setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    setInput('');
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      return toast.error('Please fill required fields');
    }

    setLoading(true);
    try {
      let res;
      if (initialData) {
        res = await axios.patch('/api/career', {
          jobId: initialData.job_id,
          ...formData,
        });
      } else {
        res = await axios.post('/api/career', formData);
      }

      if (res.data.success) {
        toast.success(`Job ${initialData ? 'updated' : 'created'} successfully`);
        onSuccess?.(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm';
  const labelCls = 'text-xs font-bold uppercase tracking-wider text-slate-400 ml-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelCls}>Job Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} placeholder="e.g. Senior React Developer" required />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Location *</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputCls} placeholder="e.g. Remote / New York" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className={labelCls}>Job Type</label>
          <select name="job_type" value={formData.job_type} onChange={handleChange} className={inputCls}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Level</label>
          <select name="level" value={formData.level} onChange={handleChange} className={inputCls}>
            <option>Junior</option>
            <option>Mid Level</option>
            <option>Senior</option>
            <option>Lead</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Compensation</label>
          <input type="text" name="compensation" value={formData.compensation} onChange={handleChange} className={inputCls} placeholder="e.g. $80k - $100k" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls}>Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} placeholder="Job description..." required />
      </div>

      {/* Array Fields */}
      {/* Responsibilities */}
      <div className="space-y-1.5">
        <label className={labelCls}>Responsibilities</label>
        <div className="flex gap-2">
          <input type="text" value={respInput} onChange={(e) => setRespInput(e.target.value)} className={inputCls} placeholder="Add a responsibility..." />
          <button type="button" onClick={() => handleAddArrayItem('responsibilities', respInput, setRespInput)} className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all">
            <FiPlus />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.responsibilities.map((item, index) => (
            <span key={index} className="flex items-center gap-1 bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-medium">
              {item}
              <button type="button" onClick={() => handleRemoveArrayItem('responsibilities', index)} className="text-violet-400 hover:text-violet-600">
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-1.5">
        <label className={labelCls}>Skills Required</label>
        <div className="flex gap-2">
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className={inputCls} placeholder="Add a skill..." />
          <button type="button" onClick={() => handleAddArrayItem('skills', skillInput, setSkillInput)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all">
            <FiPlus />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills.map((item, index) => (
            <span key={index} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
              {item}
              <button type="button" onClick={() => handleRemoveArrayItem('skills', index)} className="text-emerald-400 hover:text-emerald-600">
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Nice to have */}
      <div className="space-y-1.5">
        <label className={labelCls}>Nice to Have</label>
        <div className="flex gap-2">
          <input type="text" value={niceInput} onChange={(e) => setNiceInput(e.target.value)} className={inputCls} placeholder="Add a nice to have..." />
          <button type="button" onClick={() => handleAddArrayItem('nice_to_have', niceInput, setNiceInput)} className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all">
            <FiPlus />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.nice_to_have.map((item, index) => (
            <span key={index} className="flex items-center gap-1 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-medium">
              {item}
              <button type="button" onClick={() => handleRemoveArrayItem('nice_to_have', index)} className="text-sky-400 hover:text-sky-600">
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-4 h-4 text-violet-600 focus:ring-violet-500 border-slate-300 rounded" />
        <label className="text-sm font-medium text-slate-700">Publish Immediately</label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50">
          {loading ? 'Saving...' : initialData ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default CareerForm;
