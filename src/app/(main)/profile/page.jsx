'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaEnvelope, FaPhone, FaCalendarAlt, FaGlobe, FaCity, FaAddressCard, FaInfoCircle
} from 'react-icons/fa';
import { RiUserLine, RiSettings3Line, RiLogoutBoxRLine, RiShieldUserLine, RiMapPin2Line, RiMailLine, RiPhoneLine } from 'react-icons/ri';

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
        <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 text-center max-w-md">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
           <RiUserLine size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Authentication Required</h2>
        <p className="text-slate-500 mb-8 font-medium">Please login to view and manage your professional profile.</p>
        <Link href="/login" className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-[2rem] hover:bg-primary transition-all inline-block shadow-xl shadow-slate-900/10">Secure Login</Link>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white py-24 px-6 overflow-hidden relative">
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            
            <div className="w-48 h-48 rounded-[4rem] bg-white text-slate-900 flex items-center justify-center text-6xl font-black shadow-2xl relative z-10 select-none">
                {userData.name?.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left space-y-8 relative z-10">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <h1 className="text-6xl font-black tracking-tighter text-white leading-none">{userData.name}</h1>
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10
                            ${userData.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-primary/20 text-primary'}`}>
                            {userData.role?.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-white/40 font-bold uppercase text-[11px] tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
                        <RiShieldUserLine size={16} className="text-primary" /> Verified Profile Node 
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse ml-2"></span>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary"><RiMailLine size={18} /></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Email Protocol</span>
                            <span className="text-sm font-bold text-white/80">{userData.email}</span>
                        </div>
                    </div>
                    {userData.phone && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary"><RiPhoneLine size={18} /></div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Secure Line</span>
                                <span className="text-sm font-bold text-white/80">{userData.phone}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center"><RiMapPin2Line size={20} /></div>
                        Geographic Data
                    </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</p>
                        <p className="text-slate-800 font-bold flex items-center gap-2"><FaGlobe className="text-primary" /> {userData.country || 'Not Specified'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State / Region</p>
                        <p className="text-slate-800 font-bold flex items-center gap-2"><FaMapMarkerAlt className="text-primary" /> {userData.state || 'Not Specified'}</p>
                    </div>
                    <div className="space-y-1 text-nowrap overflow-hidden">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary City</p>
                        <p className="text-slate-800 font-bold flex items-center gap-2"><FaCity className="text-primary" /> {userData.city || 'Not Specified'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Postal Code</p>
                        <p className="text-slate-800 font-bold font-mono text-sm tracking-wider">{userData.postalCode || '---'}</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-50 space-y-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Physical Address Line 1</p>
                        <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 font-bold text-sm border border-slate-100">
                            {userData.addressLine1 || 'No primary address recorded'}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Physical Address Line 2</p>
                        <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 font-bold text-sm border border-slate-100">
                            {userData.addressLine2 || '---'}
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="flex flex-col gap-10">
                <div className="bg-slate-50 p-12 rounded-[3.5rem] flex-1 space-y-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-sm"><FaInfoCircle size={18} /></div>
                        System Metadata
                    </h3>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><FaCalendarAlt size={16} /></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarding Date</span>
                                    <span className="text-sm font-bold text-slate-800">{new Date(userData.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary text-primary rounded-2xl flex items-center justify-center"><RiShieldUserLine size={20} /></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</span>
                                    <span className={`text-sm font-black uppercase tracking-wider ${userData.isActive ? 'text-primary/50' : 'text-primary'}`}>
                                        {userData.isActive ? 'Active System Node' : 'Suspended'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link 
                        href="/dashboard"
                        className="flex-1 px-12 py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-[2.5rem] hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-900/10"
                    >
                        Management Console <span className="text-xl">→</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-24 h-24 bg-white border border-slate-100 text-primary rounded-[2.5rem] flex flex-col items-center justify-center gap-1 hover:bg-primary transition-all active:scale-95 shadow-sm"
                    >
                        <RiLogoutBoxRLine size={24} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Logout</span>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;

