'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiStar } from 'react-icons/fi';
import { MdVerifiedUser } from "react-icons/md";

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
    <section className="w-full py-16  rounded-[2.5rem] shadow-xl shadow-slate-100  p-4 my-8 flex flex-col items-center justify-center gap-8">
      
        <h2 className="text-3xl md:text-5xl font-poppins text-slate-900">What Our Clients Say</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full">
        {reviews.map((r) => (
          <div key={r.review_id} className="p-4 bg-white rounded-md even:py-10 border border-slate-100 flex flex-col justify-between">
            <div className='flex flex-col gap-3'>
              <p className="text-slate-600 text-sm italic">&quot;{r.comment}&quot;</p>
              <div className="flex gap-1  text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <div className='flex flex-row items-center gap-4'>
                <MdVerifiedUser className='text-sky-400'/>
                <p className="font-bold text-slate-900 text-sm">{r.user_name}</p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
