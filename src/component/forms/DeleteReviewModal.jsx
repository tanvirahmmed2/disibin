'use client';
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * DeleteReviewModal
 * -----------------
 * Confirmation dialog before deleting a review (used in the manager reviews panel).
 *
 * Props
 *   isOpen    — boolean
 *   review    — the review object (needs .review_id and .user_name)
 *   onConfirm — async () => void
 *   onCancel  — () => void
 *   loading   — boolean
 */
const DeleteReviewModal = ({ isOpen, review, onConfirm, onCancel, loading }) => {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto">
          <FiAlertTriangle className="text-rose-500" size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Delete Review?</h3>
          <p className="text-sm text-slate-500 mt-1">
            The review by <span className="font-bold text-rose-600">{review.user_name}</span> will be permanently removed.
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

export default DeleteReviewModal;
