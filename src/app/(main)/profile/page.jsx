'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaCity, FaInfoCircle
} from 'react-icons/fa';
import { RiUserLine,  RiLogoutBoxRLine, RiShieldUserLine, RiMapPin2Line, RiMailLine, RiPhoneLine, RiArrowRightUpLine } from 'react-icons/ri';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/user/islogin', { withCredentials: true });
        setUserData(res.data.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
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
        <div className="w-12 h-12 border-4 border-slate-50 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
           <RiUserLine size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Restricted</h2>
        <p className="text-slate-500 mb-8 font-medium">Please sign in to your account to view your professional profile data.</p>
        <Link href="/login" className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-emerald-500 transition-all inline-block shadow-lg shadow-slate-900/10 active:scale-95">Secure Login</Link>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        

        <div className="bg-white rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
            
            <div className="w-40 h-40 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-5xl font-black shadow-xl relative z-10 select-none">
                {userData.name?.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left space-y-6 relative z-10">
                <div className="space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">{userData.name}</h1>
                        <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {userData.role?.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center md:justify-start gap-2">
                        <RiShieldUserLine size={16} className="text-emerald-500" /> Identity Verified 
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><RiMailLine size={18} /></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Primary Contact</span>
                            <span className="text-sm font-bold text-slate-700">{userData.email}</span>
                        </div>
                    </div>
                    {userData.phone && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><RiPhoneLine size={18} /></div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Direct Line</span>
                                <span className="text-sm font-bold text-slate-700">{userData.phone}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            

            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <RiMapPin2Line size={20} className="text-emerald-500" />
                    Geographic Data
                </h3>
                
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</p>
                        <p className="text-slate-700 font-bold flex items-center gap-2"><FaGlobe className="text-emerald-500" /> {userData.country || '---'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State / Region</p>
                        <p className="text-slate-700 font-bold flex items-center gap-2"><FaMapMarkerAlt className="text-emerald-500" /> {userData.state || '---'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</p>
                        <p className="text-slate-700 font-bold flex items-center gap-2"><FaCity className="text-emerald-500" /> {userData.city || '---'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zip Code</p>
                        <p className="text-slate-700 font-bold">{userData.postal_code || '---'}</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Street Address</p>
                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                            {userData.address_line1 || 'No specific address recorded'}
                            {userData.address_line2 && <span className="block mt-1 text-slate-400">{userData.address_line2}</span>}
                        </p>
                    </div>
                </div>
            </div>


            <div className="flex flex-col gap-10">
                <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm flex-1 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FaInfoCircle size={18} className="text-emerald-500" />
                        System Analytics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Onboarding</span>
                            <span className="text-sm font-bold text-slate-700">{new Date(userData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${userData.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                <span className={`text-sm font-bold uppercase tracking-wider ${userData.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {userData.is_active ? 'Operational' : 'Suspended'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link 
                        href={userData?.role === 'user' ? '/user' : '/dashboard'}
                        className="flex-1 px-8 py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-3xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                        {userData?.role === 'user' ? 'Open Dashboard' : 'Management Console'} <RiArrowRightUpLine size={18} />
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-24 h-full bg-white border border-slate-100 text-slate-400 hover:text-rose-500 rounded-3xl flex flex-col items-center justify-center gap-1 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95 group"
                    >
                        <RiLogoutBoxRLine size={24} className="group-hover:translate-x-1 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Sign Out</span>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
