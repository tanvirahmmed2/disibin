'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin,
  FiCalendar, FiUserCheck, FiUserX, FiLifeBuoy,
  FiStar, FiClock, FiLoader, FiAlertCircle
} from 'react-icons/fi';

export default function TeamUserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const rawParam = params?.username;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rawParam) fetchUserProfile();
  }, [rawParam]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      let cleanParam = rawParam;
      try {
        cleanParam = decodeURIComponent(rawParam);
        if (cleanParam.includes('%')) {
          cleanParam = decodeURIComponent(cleanParam);
        }
      } catch {}

      const res = await axios.get(`/api/team/users/${encodeURIComponent(cleanParam)}`);
      if (res.data.success) {
        setProfileData(res.data.data);
      } else {
        toast.error(res.data.message || 'User profile not found');
      }
    } catch {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3 p-6 text-slate-400">
        <FiLoader className="animate-spin text-sky-500" size={28} />
        <p className="text-sm font-medium">Loading user profile by email/id...</p>
      </div>
    );
  }

  if (!profileData || !profileData.user) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4 text-center">
        <Toaster position="top-center" />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <FiAlertCircle className="mx-auto text-amber-500" size={36} />
          <h2 className="text-lg font-bold text-slate-800">User Profile Not Found</h2>
          <p className="text-xs text-slate-500">No registered account matches "{rawParam}".</p>
          <Link
            href="/team/users"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-sky-600 transition-all shadow-md"
          >
            <FiArrowLeft size={14} /> Back to Registered Users
          </Link>
        </div>
      </div>
    );
  }

  const { user, tickets, reviews, loginLogs } = profileData;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/team/users"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <FiArrowLeft size={16} /> Back to Registered Users
          </Link>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            user.is_verified
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}>
            {user.is_verified ? <FiUserCheck size={12} /> : <FiUserX size={12} />}
            {user.is_verified ? 'Verified Account' : 'Unverified Account'}
          </span>
        </div>

        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 font-extrabold text-2xl flex items-center justify-center shrink-0 border border-sky-100">
            {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>

          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-400 font-mono">User #{user.id} · {user.email}</p>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <p className="text-slate-400 font-medium flex items-center gap-1">
              <FiMail size={12} className="text-sky-500" /> Email Address
            </p>
            <a href={`mailto:${user.email}`} className="font-bold text-slate-800 hover:text-sky-600 truncate block">
              {user.email}
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 font-medium flex items-center gap-1">
              <FiPhone size={12} className="text-emerald-500" /> Phone Number
            </p>
            <p className="font-bold text-slate-800">{user.phone || 'N/A'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 font-medium flex items-center gap-1">
              <FiMapPin size={12} className="text-rose-500" /> Location
            </p>
            <p className="font-bold text-slate-800">
              {[user.city, user.country].filter(Boolean).join(', ') || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 font-medium flex items-center gap-1">
              <FiCalendar size={12} className="text-amber-500" /> Account Created
            </p>
            <p className="font-bold text-slate-800">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* User Support Tickets History */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiLifeBuoy className="text-sky-500" size={18} />
          Support Tickets ({tickets?.length || 0})
        </h2>

        {!tickets || tickets.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium py-4">No support tickets submitted by this user.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <Link href={`/team/tickets/${t.id}`} className="font-bold text-slate-800 text-sm hover:text-sky-600 transition-colors">
                    {t.title}
                  </Link>
                  <p className="text-xs text-slate-400">Created {new Date(t.created_at).toLocaleString()}</p>
                </div>
                <Link
                  href={`/team/tickets/${t.id}`}
                  className="text-xs font-bold text-sky-600 hover:underline"
                >
                  Open Ticket →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Feedback & Review */}
      {reviews && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FiStar className="text-amber-500" size={18} />
            Submitted Review & Rating
          </h2>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={14} fill={i < reviews.rating ? "currentColor" : "none"} />
              ))}
              <span className="font-bold text-slate-700 ml-1.5">{reviews.rating} Stars</span>
            </div>
            <p className="text-slate-800 font-medium">{reviews.comment}</p>
            {reviews.reply && (
              <p className="text-sky-700 font-semibold pt-1">
                Staff Reply: {reviews.reply}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Login History Logs */}
      {loginLogs && loginLogs.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FiClock className="text-slate-500" size={18} />
            Recent Login & Activity Logs
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {loginLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-slate-600">
                <span>{log.description || log.action}</span>
                <span className="text-slate-400">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
