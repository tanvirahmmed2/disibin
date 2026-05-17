'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiStar } from 'react-icons/fi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/review');
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section className="w-full py-16 bg-white rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100 p-8 my-8">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">What Our Users Say</h2>
        <p className="text-slate-500">Real feedback from real users of Disibin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.review_id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex gap-1 mb-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-slate-600 text-sm italic">"{r.comment}"</p>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-3">
              <div className="font-bold text-slate-900 text-sm">{r.user_name}</div>
              <div className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
