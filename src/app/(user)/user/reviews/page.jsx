'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiStar, FiMessageSquare, FiClock, FiCheckCircle,
  FiTrash2, FiLoader, FiSend, FiCornerDownRight
} from 'react-icons/fi';

export default function UserReviewsPage() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserReview();
  }, []);

  const fetchUserReview = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/public/review?type=me');
      if (res.data.success) {
        setReview(Array.isArray(res.data.data) ? null : res.data.data);
      }
    } catch {
      toast.error('Failed to load your review status');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a star rating');

    setSubmitting(true);
    try {
      const res = await axios.post('/api/public/review', { rating, comment: comment.trim() });
      if (res.data.success) {
        toast.success('Review submitted successfully!');
        setReview(res.data.data);
        setComment('');
      } else {
        toast.error(res.data.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your review? This cannot be undone.')) return;

    setDeleting(true);
    try {
      const res = await axios.delete(`/api/public/review/${review.id}`);
      if (res.data.success) {
        toast.success('Review deleted');
        setReview(null);
      } else {
        toast.error(res.data.message || 'Failed to delete review');
      }
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 w-full space-y-6">
      <Toaster position="top-center" />

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <FiStar size={20} />
          </span>
          My Review & Feedback
        </h1>
        <p className="text-slate-500 text-sm pl-11">
          Share your experience working with Disibin and view official staff responses
        </p>
      </div>

      {loading ? (
        <div className="py-16 bg-white rounded-3xl border border-slate-100 shadow-sm text-center text-slate-400 space-y-2">
          <FiLoader className="animate-spin mx-auto text-amber-500" size={28} />
          <p className="text-sm font-medium">Loading your feedback status...</p>
        </div>
      ) : review ? (
        /* Existing Review Card */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                review.is_approved
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {review.is_approved ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                {review.is_approved ? 'Approved & Published' : 'Pending Moderation'}
              </span>
            </div>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-100 transition-all self-start sm:self-auto disabled:opacity-50"
            >
              {deleting ? <FiLoader className="animate-spin" size={13} /> : <FiTrash2 size={13} />}
              Delete Review
            </button>
          </div>

          {/* Star Rating Display */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={24}
                  className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Review</p>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {review.comment || 'No comment text provided.'}
            </p>
            <p className="text-[11px] text-slate-400 pt-1 font-medium">
              Submitted on {new Date(review.created_at).toLocaleString()}
            </p>
          </div>

          {/* Manager Staff Reply */}
          {review.reply && (
            <div className="bg-primary/10/70 p-5 rounded-2xl border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary-dark">
                <FiCornerDownRight size={14} />
                Official Response from Disibin Team
              </div>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap pl-5">
                {review.reply}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* New Review Form */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Submit a Review</h2>
            <p className="text-xs text-slate-500">How would you rate your experience working with us?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Interactive Rating Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Rating *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <FiStar
                      size={28}
                      className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Review Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share detail about your project, service quality, and teamwork experience..."
                rows={4}
                className="input-style text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-amber-500 text-white rounded-2xl font-bold text-sm transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? <FiLoader className="animate-spin" size={16} /> : <FiSend size={16} />}
              {submitting ? 'Submitting Review...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
