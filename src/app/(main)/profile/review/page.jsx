'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaClock, FaPlus } from 'react-icons/fa';
import AddReviewForm from '@/component/forms/AddReviewForm';
import Image from 'next/image';
import { MdDeleteOutline } from 'react-icons/md';

const UserReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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



  const delteReivew = async (id) => {
    const confirm = window.confirm('Do you want to delete your review parmanently?')
    if (!confirm) return
    try {
      const res = await axios.delete('/api/review', { data: { id }, withCredentials: true })
      alert(res.data.message)

      fetchReviews();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete review')

    }
  }
  useEffect(() => {

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
    <div className="w-full flex min-h-screen flex-col items-center justify-center p-1 sm:p-4 gap-4">
      <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Personal Feedback</h2>


      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl  gap-6">
          <FaQuoteLeft className="text-slate-100 text-5xl mb-4" />
          <p className="text-slate-400 font-light tracking-wide">You have not shared your experience yet.</p>
          <AddReviewForm />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.review_id}
              className="group w-full bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-sky-50 transition-all relative"
            >
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

              <div className="flex gap-1 mb-6"> {[...Array(5)].map((_, star) => (
                <FaStar
                  key={star}
                  className={`text-sm ${star < rev.rating ? "text-amber-400" : "text-slate-100"}`}
                />
              ))}  </div>

              <div className="relative">
                <FaQuoteLeft className="absolute -top-2 -left-4 text-slate-50 text-4xl z-0" />
                <p className="relative z-10 text-slate-600 font-light leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">

                  <Image className='rounded-2xl overflow-hidden object-cover' src={rev.user_image} alt='user image' width={40} height={40} />
                  <div>
                    <p className=" font-bold text-slate-800 uppercase tracking-tighter">Reviewed</p>
                    <p className=" text-slate-400">{new Date(rev.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <button className='text-3xl text-red-500 cursor-pointer ' onClick={() => delteReivew(rev.review_id)}><MdDeleteOutline /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReview;