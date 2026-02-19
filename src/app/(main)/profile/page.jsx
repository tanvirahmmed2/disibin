'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt,
  FaEnvelope, FaPhone, FaCalendarAlt, FaShieldAlt,
} from 'react-icons/fa';

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
    <div className=" w-full min-h-screen flex items-center justify-center p-4 flex-col ">

      <div className='w-auto flex flex-col items-center justify-center gap-4  shadow-2xl rounded-2xl p-20'>
        <div className="relative flex flex-col md:flex-row items-center gap-8">


          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-light text-slate-800 tracking-tight">{userData.name}</h1>

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
        <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-2'>
          <Link className='w-full text-center bg-gray-200 rounded-2xl hover:bg-white' href={'/profile/purchased_package'}>Orders</Link>
          <Link className='w-full text-center bg-gray-200 rounded-2xl hover:bg-white' href={'/profile/review'}>Reviews</Link>
          <Link className='w-full text-center bg-gray-200 rounded-2xl hover:bg-white' href={'/profile/supports'}>Supports</Link>
        </div>
        <button className='w-full text-center px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-400 rounded-2xl cursor-pointer' onClick={async()=>{
          try {
            const res= await axios.get('/api/user/logout', {withCredentials:true})
            alert(res.data.message)
            window.location.replace('/login')
          } catch (error) {
            alert(error?.response?.data?.message || 'Failed to logout')
            
          }
        }}>Logout</button>
      </div>
    </div>
  );
};



export default UserProfile;