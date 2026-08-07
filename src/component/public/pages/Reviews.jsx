'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { MdVerifiedUser } from "react-icons/md";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/public/review?type=public&limit=8');
        if (res.data.success && Array.isArray(res.data.data)) {
          setReviews(res.data.data.slice(0, 10));
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
    fetchReviews();
  }, []);

  if (loading) return null;
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return null;

  return (
    <section className="w-full py-16 rounded-[2.5rem] shadow-xl shadow-slate-100 my-8 flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-5">
        
        <h2 className="text-3xl md:text-5xl font-poppins text-slate-900 font-semibold">
          What Our <span className="gradient-text font-bold">Clients</span> Say
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {reviews.map((r) => (
          <div key={r.id} className="p-5 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col gap-3">
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">&quot;{r.comment || 'Great service!'}&quot;</p>
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill={i < (r.rating || 5) ? "currentColor" : "none"} size={14} />
                ))}
              </div>
              <div className="flex flex-row items-center gap-2 pt-2 border-t border-slate-50">
                <MdVerifiedUser className="text-primary shrink-0" size={16} />
                <p className="font-bold text-slate-900 text-xs font-poppins truncate">{r.user_name || 'Verified Client'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-xs font-semibold font-poppins hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
        >
          <span>View All Client Reviews</span>
          <FiArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default Reviews;
