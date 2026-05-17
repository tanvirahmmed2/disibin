'use client';
import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

/**
 * ReviewForm
 * ----------
 * Star-rating + comment form for submitting a platform review.
 *
 * Props
 *   onSuccess — (reviewData) => void, called after successful submission
 */
const ReviewForm = ({ onSuccess }) => {
  const [formData,   setFormData]   = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) return toast.error('Please write a comment');

    setSubmitting(true);
    try {
      const res = await axios.post('/api/review', formData);
      if (res.data.success) {
        toast.success('Review submitted successfully!');
        onSuccess?.(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      {/* Star picker */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Your Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setFormData({ ...formData, rating: star })}
              className="focus:outline-none transform hover:scale-110 transition-transform"
            >
              <FiStar
                className={`w-8 h-8 ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Your Comment</label>
        <textarea
          required
          rows={4}
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
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
  );
};

export default ReviewForm;
