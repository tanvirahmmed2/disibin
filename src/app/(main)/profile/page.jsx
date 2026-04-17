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
        <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card-premium p-12 text-center max-w-md">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
           <RiUserLine size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Authentication Required</h2>
        <p className="text-slate-500 mb-8 font-medium">Please login to view and manage your professional profile.</p>
        <Link href="/login" className="btn-primary inline-block">Secure Login</Link>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="card-premium p-12 flex flex-col md:flex-row items-center gap-10 border-none bg-slate-50/50">
          <div className="w-40 h-40 rounded-[3rem] bg-primary flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary/20 shrink-0 select-none">
            {userData.name?.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{userData.name}</h1>
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full w-fit mx-auto md:mx-0">
                  {userData.role?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em]">Verified Member Profile</p>
            </div>

            <div className="flex flex-col gap-3 text-slate-600 font-bold">
               <span className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary"><FaEnvelope size={14} /></div> {userData.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-start">
            <Link 
                href={'/dashboard'}
                className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-[2rem] hover:bg-primary transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-slate-900/10"
            >
                Enter Dashboard <span className="text-xl">→</span>
            </Link>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
