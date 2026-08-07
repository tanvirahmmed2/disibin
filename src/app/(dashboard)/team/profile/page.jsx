'use client';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Context } from '@/component/helper/Context';
import { Toaster, toast } from 'react-hot-toast';
import {
  FiShield, FiMail, FiPhone, FiMapPin, FiClock,
  FiEdit3, FiLock, FiCheckCircle, FiXCircle, FiCalendar, FiBriefcase
} from 'react-icons/fi';

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '—';

export default function TeamProfilePage() {
  const { teamData, setTeamData } = useContext(Context);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/team/me');
      if (res.data.success) {
        setProfile(res.data.data);
        setTeamData(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (error) {
      toast.error('Failed to load team profile details');
    } finally {
      setLoading(false);
    }
  };

  const member = profile || teamData;

  if (loading && !member) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading team profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full space-y-6">
      <Toaster position="top-center" />

      <div className="relative overflow-hidden bg-primary rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
              {(member?.name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">{member?.name || 'Team Profile'}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${
                  member?.role === 'manager' ? 'bg-secondary/100/20 text-amber-300 border-amber-500/30' :
                  member?.role === 'developer' ? 'bg-primary/100/20 text-violet-300 border-violet-500/30' :
                  'bg-primary/100/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {member?.role || 'Team Member'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{member?.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                  <FiBriefcase size={12} className="text-primary-light" /> Disibin Staff
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                  <FiCalendar size={12} className="text-emerald-400" /> Joined {fmtDate(member?.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/team/settings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all shadow-md"
            >
              <FiEdit3 size={15} /> Edit Profile
            </Link>
            <Link
              href="/team/security"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-all border border-white/10"
            >
              <FiLock size={15} /> Security
            </Link>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Member & Contact Details */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FiShield size={16} />
            </span>
            Member Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{member?.name || '—'}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-bold text-slate-800">{member?.email || '—'}</p>
                {member?.is_verified ? (
                  <span className="text-xs text-primary font-semibold inline-flex items-center gap-1">
                    <FiCheckCircle size={12} /> Verified
                  </span>
                ) : (
                  <span className="text-xs text-secondary font-semibold inline-flex items-center gap-1">
                    <FiXCircle size={12} /> Pending Verification
                  </span>
                )}
              </div>
              {member?.pending_email && (
                <p className="text-xs text-primary mt-1 font-medium bg-primary/10 p-2 rounded-lg border border-primary/20">
                  Pending email change to: <strong>{member.pending_email}</strong> (Verification code sent to current email)
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Role</p>
              <p className="text-sm font-bold text-slate-800 capitalize mt-1">{member?.role || '—'}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{member?.phone || '— Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FiMapPin size={16} />
            </span>
            Address Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Street Address</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{member?.address_line1 || '— Not provided'}</p>
            </div>

            {member?.address_line2 && (
              <div className="col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Address Line 2</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{member.address_line2}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">City</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{member?.city || '—'}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">State / Region</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{member?.state || '—'}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Country</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{member?.country || '—'}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Postal Code</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{member?.postal_code || '—'}</p>
            </div>
          </div>
        </div>

        {/* Account Status & Timestamps */}
        <div className="md:col-span-2 bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FiClock size={16} />
            </span>
            System Access & Timestamps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member ID</p>
              <p className="text-sm font-bold text-slate-900 mt-1">#TM-{member?.id}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
              <p className="text-sm font-bold text-primary mt-1 flex items-center gap-1">
                <FiCheckCircle size={14} /> Active
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Created On</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{fmtDate(member?.created_at)}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Login</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{fmtDate(member?.last_login)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
