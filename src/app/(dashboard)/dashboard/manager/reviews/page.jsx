'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiStar, FiTrash2, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const ManagerReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/review?type=all');
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`/api/review/${id}`, { is_approved: !currentStatus });
      if (res.data.success) {
        toast.success(`Review ${!currentStatus ? 'approved' : 'hidden'} successfully`);
        setReviews(reviews.map(r => r.review_id === id ? { ...r, is_approved: !currentStatus } : r));
      }
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review completely?')) return;
    
    try {
      const res = await axios.delete(`/api/review/${id}`);
      if (res.data.success) {
        toast.success('Review deleted successfully');
        setReviews(reviews.filter(r => r.review_id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-center" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiStar className="text-sky-500" /> Customer Reviews
          </h1>
          <p className="text-slate-500 text-sm">Approve or moderate user feedback.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Rating & Comment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400">No reviews found</td>
                </tr>
              ) : reviews.map((review) => (
                <tr key={review.review_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{review.user_name}</div>
                    <div className="text-xs text-slate-400">{review.user_email}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 truncate" title={review.comment}>
                      "{review.comment}"
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-max ${
                      review.is_approved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {review.is_approved ? <FiCheckCircle /> : <FiClock />}
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleApproval(review.review_id, review.is_approved)}
                      title={review.is_approved ? "Hide Review" : "Approve Review"}
                      className={`p-2 rounded-lg transition-all ${
                        review.is_approved 
                          ? 'text-amber-500 hover:bg-amber-50' 
                          : 'text-emerald-500 hover:bg-emerald-50'
                      }`}
                    >
                      {review.is_approved ? <FiXCircle size={18} /> : <FiCheckCircle size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(review.review_id)}
                      title="Delete Review"
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerReviewsPage;
