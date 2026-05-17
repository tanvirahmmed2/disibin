'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Context } from '@/component/helper/Context';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';

/**
 * ProfileForm
 * -----------
 * Shared form for /user/profile and /user/settings.
 * Reads initial data from Context (userData) and from the /api/user endpoint.
 *
 * Props
 *   onSaved — optional (updatedUser) => void callback after a successful save
 */
const ProfileForm = ({ onSaved }) => {
  const { userData, setUserData } = useContext(Context);
  const [loading,    setLoading]    = useState(false);
  const [formData,   setFormData]   = useState({
    name: '', phone: '', city: '', country: '',
    address_line1: '', address_line2: '', state: '', postal_code: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name:          userData.name          || '',
        phone:         userData.phone         || '',
        city:          userData.city          || '',
        country:       userData.country       || '',
        address_line1: userData.address_line1 || '',
        address_line2: userData.address_line2 || '',
        state:         userData.state         || '',
        postal_code:   userData.postal_code   || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Profile updated successfully!');
        const updated = { ...userData, ...data.data };
        setUserData(updated);
        onSaved?.(updated);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none';
  const labelCls = 'text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Personal Info card */}
      <div className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <FiUser className="text-sky-500" /> Personal Info
        </h2>

        <div className="space-y-1.5">
          <label className={labelCls}>Full Name</label>
          <div className="relative">
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${inputCls} pl-12`} placeholder="John Doe" />
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="space-y-1.5 opacity-60">
          <label className={labelCls}>Email (Locked)</label>
          <div className="relative">
            <input type="email" value={userData?.email || ''} disabled className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-100 border-none cursor-not-allowed outline-none" />
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Phone Number</label>
          <div className="relative">
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={`${inputCls} pl-12`} placeholder="+1 234 567 890" />
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Address card */}
      <div className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <FiMapPin className="text-sky-500" /> Address Details
        </h2>

        <div className="space-y-1.5">
          <label className={labelCls}>Street Address</label>
          <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} className={inputCls} placeholder="123 Studio Way" />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Address Line 2 (Optional)</label>
          <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} className={inputCls} placeholder="Apt 4B" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelCls}>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputCls} placeholder="New York" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputCls} placeholder="NY" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelCls}>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className={inputCls} placeholder="USA" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Postal Code</label>
            <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className={inputCls} placeholder="10001" />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="md:col-span-2 flex justify-end mt-4">
        <button
          disabled={loading}
          className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300 shadow-xl shadow-slate-900/10 disabled:bg-slate-400"
        >
          <FiSave /> {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
