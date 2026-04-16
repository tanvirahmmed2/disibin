'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaEnvelope, FaPhone, FaCalendarAlt
} from 'react-icons/fa';
import { RiUserLine, RiSettings3Line, RiLogoutBoxRLine } from 'react-icons/ri';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/user/islogin', { withCredentials: true });
        setUserData(res.data.payload);
      } catch (error) {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('/api/user/logout', { withCredentials: true })
      window.location.replace('/login')
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to logout')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card-premium p-12 text-center max-w-md">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
           <RiUserLine size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Not logged in</h2>
        <p className="text-slate-500 mb-8">Please login to view and manage your profile.</p>
        <Link href="/login" className="btn-primary inline-block">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="card-premium p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-emerald-500/20 shrink-0">
            {userData.name?.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{userData.name}</h1>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full w-fit mx-auto md:mx-0">
                {userData.role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-slate-500 text-sm font-bold">
              <span className="flex items-center justify-center md:justify-start gap-3">
                <FaEnvelope className="text-slate-300" /> {userData.email}
              </span>
              <span className="flex items-center justify-center md:justify-start gap-3">
                <FaPhone className="text-slate-300" /> {userData.phone || 'N/A'}
              </span>
              <span className="flex items-center justify-center md:justify-start gap-3">
                <FaMapMarkerAlt className="text-slate-300" /> {userData.city ? `${userData.city}, ${userData.country}` : 'Global'}
              </span>
              <span className="flex items-center justify-center md:justify-start gap-3">
                <FaCalendarAlt className="text-slate-300" /> Member since {new Date(userData.created_at).getFullYear()}
              </span>
            </div>
          </div>
        </div>

        <div className="card-premium p-10 bg-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-xl font-black text-slate-800">Operational Dashboard</h3>
              <p className="text-slate-500 font-medium">Manage your subscription, tickets and security.</p>
            </div>
             <Link 
              href={'/dashboard'}
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
            >
              <RiSettings3Line size={20} /> Open Dashboard
            </Link>
          </div>
        </div>

        <div className="card-premium p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-xl font-black text-slate-800">Account Security</h3>
              <p className="text-slate-500 font-medium">Terminate your current session safely.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-8 py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2 active:scale-95"
            >
              <RiLogoutBoxRLine size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
