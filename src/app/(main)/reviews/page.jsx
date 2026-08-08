'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiStar, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { MdVerifiedUser } from 'react-icons/md';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await axios.get('/api/public/review?type=public');
        if (res.data.success && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="w-full min-h-screen py-16 px-4 md:px-8 space-y-12">
      
      <div className="text-center w-full space-y-4">
       
        <h1 className="text-4xl sm:text-6xl font-poppins font-semibold text-slate-900 leading-tight">
          What Our <span className="text-primary font-bold">Clients & Partners</span> Say
        </h1>
        <p className="text-slate-500 font-poppins text-base leading-relaxed max-w-2xl mx-auto">
          Read authentic feedback from organizations and creators who build their digital products and business innovation systems with Disibin.
        </p>

        <div className="inline-flex items-center gap-6 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-lg mt-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-poppins text-amber-400">{avgRating}</span>
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} fill="currentColor" size={16} />
              ))}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <span className="text-xs font-medium text-slate-300 font-poppins">
            Based on <strong className="text-white">{totalReviews}</strong> Verified Reviews
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200/60 max-w-xl mx-auto space-y-4">
          <FiMessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-poppins font-bold text-slate-800 text-lg">No reviews found yet</h3>
          <p className="text-slate-500 text-xs">Be the first client to leave a testimonial for Disibin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="glass bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} fill={i < (r.rating || 5) ? "currentColor" : "none"} size={16} />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 font-poppins">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Verified Review'}
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-poppins italic">
                  &quot;{r.comment || 'Outstanding service and technical delivery!'}&quot;
                </p>

                {r.reply && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase font-poppins">Disibin Response:</span>
                    <p className="text-slate-600 text-xs font-poppins">{r.reply}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm font-poppins truncate">{r.user_name || 'Verified Client'}</span>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-poppins text-2xl font-bold text-white">Have you worked with Disibin?</h3>
          <p className="text-slate-400 text-sm font-poppins max-w-md">
            Log in to your account dashboard to submit your client review and feedback.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/user/reviews"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold font-poppins transition-colors shadow-md flex items-center gap-2"
          >
            <FiCheckCircle size={14} />
            <span>Submit a Review</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
