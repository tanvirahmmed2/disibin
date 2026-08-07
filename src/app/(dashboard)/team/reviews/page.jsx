'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiStar, FiCheckCircle, FiXCircle, FiMessageSquare,
  FiTrash2, FiLoader, FiX, FiRefreshCw, FiEdit3, FiSend
} from 'react-icons/fi';

export default function TeamReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Reply Modal State
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/public/review?type=all');
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (review, approvedState) => {
    setUpdating(review.id);
    try {
      const res = await axios.patch(`/api/public/review/${review.id}`, { is_approved: approvedState });
      if (res.data.success) {
        toast.success(`Review ${approvedState ? 'approved' : 'rejected'}`);
        setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_approved: approvedState } : r));
      } else {
        toast.error(res.data.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update review approval');
    } finally {
      setUpdating(null);
    }
  };

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply || '');
  };

  const handleSendReply = async () => {
    if (!selectedReview) return;
    setSendingReply(true);
    try {
      const res = await axios.patch(`/api/public/review/${selectedReview.id}`, { reply: replyText.trim() });
      if (res.data.success) {
        toast.success('Staff reply updated');
        const updated = res.data.data;
        setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
        setSelectedReview(null);
      } else {
        toast.error(res.data.message || 'Failed to update reply');
      }
    } catch {
      toast.error('Failed to save reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    setDeleting(id);
    try {
      const res = await axios.delete(`/api/public/review/${id}`);
      if (res.data.success) {
        toast.success('Review deleted');
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(null);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  const totalCount = reviews.length;
  const pendingCount = reviews.filter(r => !r.is_approved).length;
  const approvedCount = reviews.filter(r => r.is_approved).length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <FiStar size={20} />
            </span>
            Client Reviews Moderation
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Moderate client ratings, approve public testimonials, and post official staff replies
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs self-start sm:self-auto shadow-sm"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          Refresh List
        </button>
      </div>

      {/* Metric Badges & Filter Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Reviews', count: totalCount },
            { id: 'pending', label: 'Pending Approval', count: pendingCount },
            { id: 'approved', label: 'Approved', count: approvedCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full ${
                filter === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Content Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-secondary" size={28} />
            <p className="text-sm font-medium">Loading client reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiStar className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No reviews found</p>
            <p className="text-xs text-slate-500">There are no client reviews matching your filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((r) => (
              <div key={r.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* User info & Stars */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-base">{r.user_name}</h3>
                      <span className="text-xs text-slate-400">({r.user_email})</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={16}
                          className={star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-1.5">{r.rating} / 5</span>
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => toggleApproval(r, !r.is_approved)}
                      disabled={updating === r.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        r.is_approved
                          ? 'bg-primary/10 text-primary border-primary/20 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                          : 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                      }`}
                    >
                      {updating === r.id ? (
                        <FiLoader className="animate-spin" size={13} />
                      ) : r.is_approved ? (
                        <FiCheckCircle size={13} />
                      ) : (
                        <FiXCircle size={13} />
                      )}
                      {r.is_approved ? 'Approved (Click to Reject)' : 'Approve Review'}
                    </button>

                    <button
                      onClick={() => openReplyModal(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-primary/10 text-slate-700 hover:text-primary border border-slate-200 rounded-xl text-xs font-bold transition-all"
                    >
                      <FiEdit3 size={13} />
                      {r.reply ? 'Edit Staff Reply' : 'Add Reply'}
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-40"
                      title="Delete Review"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-slate-800 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {r.comment || 'No text comment provided.'}
                </p>

                {/* Staff Reply callout */}
                {r.reply && (
                  <div className="bg-primary/10/70 p-4 rounded-2xl border border-primary/20 space-y-1">
                    <p className="text-xs font-bold text-primary-dark flex items-center gap-1.5">
                      <FiMessageSquare size={13} /> Official Staff Reply
                    </p>
                    <p className="text-slate-700 text-sm leading-relaxed pl-5">
                      {r.reply}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Staff Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FiMessageSquare className="text-primary" size={18} />
                Reply to {selectedReview.user_name}
              </h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-800">Review from {selectedReview.user_name}</p>
                <p className="text-slate-600 line-clamp-2">{selectedReview.comment}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Staff Response *
                </label>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Thank the user or address their feedback..."
                  rows={4}
                  className="input-style text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={sendingReply}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-primary text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
                >
                  {sendingReply ? <FiLoader className="animate-spin" size={14} /> : <FiSend size={14} />}
                  {sendingReply ? 'Saving Reply...' : 'Save Staff Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
