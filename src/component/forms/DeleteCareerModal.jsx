'use client';
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * DeleteCareerModal
 * -----------------
 * Confirmation dialog before deleting a job listing.
 */
const DeleteCareerModal = ({ isOpen, job, onConfirm, onCancel, loading }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto">
          <FiAlertTriangle className="text-rose-500" size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Delete Job Listing?</h3>
          <p className="text-sm text-slate-500 mt-1">
            The job listing <span className="font-bold text-rose-600">{job.title}</span> will be permanently removed.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCareerModal;
