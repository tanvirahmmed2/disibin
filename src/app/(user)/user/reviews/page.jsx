'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiStar, FiTrash2, FiMessageSquare, FiCheckCircle, FiClock } from 'react-icons/fi';
import ReviewForm from '@/component/forms/ReviewForm';

const UserReviewPage = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoad, setDeleteLoad] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/review?type=user');
      if (res.data.success && res.data.data) setReview(res.data.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return;
    setDeleteLoad(true);
    try {
      const res = await axios.delete(`/api/review/${review.review_id}`);
      if (res.data.success) {
        toast.success('Review deleted');
        setReview(null);
      }
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleteLoad(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Toaster position="top-center" />

      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FiStar className="text-amber-400" /> My Feedback
        </h1>
        <p className="text-slate-500 text-sm mt-1">Share your experience with our platform. You can leave one review.</p>
      </div>

      {review ? (
        /* Existing review display */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${review.is_approved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {review.is_approved ? <FiCheckCircle /> : <FiClock />}
                  {review.is_approved ? 'Approved & Published' : 'Pending Approval'}
                </span>
                <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full">General Platform</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleteLoad}
              className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium text-sm disabled:opacity-50"
            >
              <FiTrash2 /> {deleteLoad ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-slate-700 italic">"{review.comment}"</p>
          </div>

          {review.reply && (
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex gap-3">
              <FiMessageSquare className="text-sky-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Response from Management</p>
                <p className="text-sm text-sky-900">{review.reply}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ReviewForm from component/forms */
        <ReviewForm onSuccess={(data) => setReview(data)} />
      )}
    </div>
  );
};

export default UserReviewPage;
