'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaEnvelope, FaPhone, FaCalendarAlt, FaShieldAlt,
} from 'react-icons/fa';
import { RiUserLine, RiSettings3Line, RiLogoutBoxRLine, RiShoppingBag3Line, RiMessage2Line, RiStarLine } from 'react-icons/ri';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/user/islogin', { withCredentials: true });
        setUserData(res.data.payload);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/user/logout', { withCredentials: true })
      window.location.replace('/login')
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to logout')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <div className="text-slate-400 font-medium animate-pulse">Loading profile...</div>
      </div>
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
    <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="card-premium p-8 md:p-12 mb-8 bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-emerald-500/40 shrink-0">
              {userData.name?.charAt(0)}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{userData.name}</h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full w-fit mx-auto md:mx-0">
                  {userData.role}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-500 text-sm font-medium">
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FaEnvelope className="text-emerald-500" /> {userData.email}
                </span>
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FaPhone className="text-emerald-500" /> {userData.phone || 'Phone unset'}
                </span>
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FaMapMarkerAlt className="text-emerald-500" /> {userData.city ? `${userData.city}, ${userData.country}` : 'Location unset'}
                </span>
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FaCalendarAlt className="text-emerald-500" />
                  Joined {new Date(userData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Link Zone */}
        <div className="card-premium p-8 bg-white mb-8 border border-emerald-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Access Dashboard</h3>
              <p className="text-slate-500 text-sm">Update your profile settings, view purchases, and manage support tickets inside your unified control panel.</p>
            </div>
             <Link 
              href={'/dashboard'}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
            >
              <RiSettings3Line size={20} /> Open Dashboard
            </Link>
          </div>
        </div>

        {/* Dangerous Zone */}
        <div className="card-premium p-8 bg-white border-red-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Account Actions</h3>
              <p className="text-slate-500 text-sm">Logout of your account or manage security settings.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-8 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 active:scale-95"
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