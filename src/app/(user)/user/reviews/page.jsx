'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiStar, FiTrash2, FiMessageSquare, FiCheckCircle, FiClock } from 'react-icons/fi';

const UserReviewPage = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user's existing review
      const reviewRes = await axios.get('/api/review');
      if (reviewRes.data.success && reviewRes.data.data) {
        setReview(reviewRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) return toast.error('Please write a comment');

    setSubmitting(true);
    try {
      const res = await axios.post('/api/review', formData);
      if (res.data.success) {
        toast.success('Review submitted successfully!');
        setReview(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    
    try {
      const res = await axios.delete(`/api/review/${review.review_id}`);
      if (res.data.success) {
        toast.success('Review deleted');
        setReview(null);
        setFormData({ rating: 5, comment: '' });
      }
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  review.is_approved 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {review.is_approved ? <FiCheckCircle /> : <FiClock />}
                  {review.is_approved ? 'Approved & Published' : 'Pending Approval'}
                </span>
                <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full">
                  General Platform
                </span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium text-sm"
            >
              <FiTrash2 /> Delete
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
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Your Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({...formData, rating: star})}
                  className="focus:outline-none transform hover:scale-110 transition-transform"
                >
                  <FiStar className={`w-8 h-8 ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Your Comment</label>
            <textarea
              required
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
              placeholder="Tell us what you think..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserReviewPage;
