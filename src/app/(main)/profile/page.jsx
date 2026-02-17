'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FaBox, FaStar, FaHeadset, FaMapMarkerAlt,
  FaEnvelope, FaPhone, FaCalendarAlt, FaShieldAlt,
  FaArrowRight, FaHistory
} from 'react-icons/fa';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('packages');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/user', { withCredentials: true });
        // Since backend sends result.rows[0], res.data.payload is the user object
        setUserData(res.data.payload);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-sky-200 rounded-2xl mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400 font-light">Failed to load profile. Please login again.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-tr from-sky-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-4xl font-light shadow-xl shadow-sky-100">
                {userData.name?.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                <FaShieldAlt className="text-emerald-500 text-xl" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-light text-slate-800 tracking-tight">{userData.name}</h1>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {userData.role}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-slate-500 text-sm">
                <span className="flex items-center gap-2"><FaEnvelope className="text-sky-400" /> {userData.email}</span>
                <span className="flex items-center gap-2"><FaPhone className="text-sky-400" /> {userData.phone || 'N/A'}</span>
                <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400" /> {userData.city || 'Location unset'}, {userData.country}</span>
                <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-sky-400" /> 
                    Joined {new Date(userData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <Link href={'/profile/update'} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-center">
          <nav className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 shadow-sm">
            {[
              { id: 'packages', label: 'Subscriptions', icon: <FaBox /> },
              { id: 'reviews', label: 'Feedback', icon: <FaStar /> },
              { id: 'support', label: 'Assistance', icon: <FaHeadset /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* CONTENT SECTION */}
        <div className="min-h-[400px]">
          {/* Subscriptions */}
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {userData.purchase_packages?.length > 0 ? (
                userData.purchase_packages.map((pkg, i) => (
                  <div key={i} className="group bg-white p-8 rounded-3xl border border-slate-200/60 hover:border-sky-200 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl"><FaBox /></div>
                      <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full ${
                          pkg.status === 'active' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'
                      }`}>
                        {pkg.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-slate-800 mb-1">{pkg.package_title}</h3>
                    <p className="text-3xl font-light text-slate-900 mb-6">৳{pkg.amount_paid}</p>
                    <div className="pt-6 border-t border-slate-50 flex justify-between text-[11px] text-slate-400">
                      <span>Expires: {new Date(pkg.expiry_date).toLocaleDateString()}</span>
                      <span className="text-sky-500 font-bold uppercase cursor-pointer">Details</span>
                    </div>
                  </div>
                ))
              ) : <EmptyState icon={<FaBox />} text="No subscriptions yet." />}
            </div>
          )}

          {/* Feedback */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {userData.reviews?.length > 0 ? (
                userData.reviews.map((rev, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 flex flex-col sm:flex-row gap-6">
                    <div className="flex gap-1 shrink-0 text-amber-400">
                      {[...Array(5)].map((_, s) => <FaStar key={s} className={s < rev.rating ? "opacity-100" : "opacity-20"} />)}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-600 font-light italic leading-relaxed">"{rev.comment}"</p>
                      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(rev.created_at).toDateString()} • {rev.is_approved ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))
              ) : <EmptyState icon={<FaStar />} text="No feedback found." />}
            </div>
          )}

          {/* Support */}
          {activeTab === 'support' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {userData.support_messages?.length > 0 ? (
                userData.support_messages.map((msg, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"><FaHistory /></div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">{msg.subject}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(msg.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{msg.status}</span>
                  </div>
                ))
              ) : <EmptyState icon={<FaHeadset />} text="No support history." />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-white/40 border border-dashed border-slate-200 rounded-3xl">
    <div className="text-slate-200 text-5xl mb-4">{icon}</div>
    <p className="text-slate-400 font-light tracking-wide">{text}</p>
  </div>
);

export default UserProfile;