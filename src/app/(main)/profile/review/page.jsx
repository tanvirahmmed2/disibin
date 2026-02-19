'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaClock, FaPlus } from 'react-icons/fa';
import AddReviewForm from '@/component/forms/AddReviewForm';

const UserReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/user/review', { withCredentials: true });
        setReviews(res.data.payload);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="h-40 w-full bg-white rounded-3xl animate-pulse border border-slate-100" />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-light text-slate-800 tracking-tight">Personal Feedback</h2>
        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-600 hover:text-sky-700 transition-colors">
          <FaPlus className="text-[10px]" /> Write a Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/40 border border-dashed border-slate-200 rounded-3xl">
          <FaQuoteLeft className="text-slate-100 text-5xl mb-4" />
          <p className="text-slate-400 font-light tracking-wide">You have not shared your experience yet.</p>
          <AddReviewForm/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev, i) => (
            <div 
              key={i} 
              className="group bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-sky-50 transition-all relative"
            >
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                {rev.is_approved ? (
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                    <FaCheckCircle /> Published
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                    <FaClock /> Pending
                  </div>
                )}
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, star) => (
                  <FaStar 
                    key={star} 
                    className={`text-sm ${star < rev.rating ? "text-amber-400" : "text-slate-100"}`} 
                  />
                ))}
              </div>

              {/* Review Content */}
              <div className="relative">
                <FaQuoteLeft className="absolute -top-2 -left-4 text-slate-50 text-4xl -z-0" />
                <p className="relative z-10 text-slate-600 font-light leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {rev.user_email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-tighter">Your Verified Review</p>
                    <p className="text-[10px] text-slate-400">{new Date(rev.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReview;