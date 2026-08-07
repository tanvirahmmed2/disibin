'use client';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '@/component/helper/Context';
import { Toaster, toast } from 'react-hot-toast';
import { FiUser, FiPhone, FiMapPin, FiSave, FiSettings } from 'react-icons/fi';

const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder-slate-400';
const labelCls = 'text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block';

export default function TeamSettingsPage() {
  const { teamData, setTeamData } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', country: '',
    address_line1: '', address_line2: '', state: '', postal_code: '',
  });

  useEffect(() => {
    if (teamData) {
      setFormData({
        name:          teamData.name          || '',
        phone:         teamData.phone         || '',
        city:          teamData.city          || '',
        country:       teamData.country       || '',
        address_line1: teamData.address_line1 || '',
        address_line2: teamData.address_line2 || '',
        state:         teamData.state         || '',
        postal_code:   teamData.postal_code   || '',
      });
    }
  }, [teamData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Full name is required');

    setLoading(true);
    try {
      const res = await axios.patch('/api/team/me', formData);
      if (res.data.success) {
        toast.success('Team profile updated successfully!');
        const updated = { ...teamData, ...res.data.data };
        setTeamData(updated);
      } else {
        toast.error(res.data.message || 'Failed to update settings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full space-y-6">
      <Toaster position="top-center" />

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
          <FiSettings size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Team Profile Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Update your contact information and office address details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FiUser size={16} />
            </span>
            Member Information
          </h2>

          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Email Address (Locked)</label>
            <input
              type="email"
              value={teamData?.email || ''}
              disabled
              className={`${inputCls} opacity-60 bg-slate-100 cursor-not-allowed`}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              To update email, navigate to the <a href="/team/security" className="text-slate-800 underline">Security page</a>.
            </span>
          </div>

          <div>
            <label className={labelCls}>Role (Assigned)</label>
            <input
              type="text"
              value={teamData?.role || 'Team Member'}
              disabled
              className={`${inputCls} opacity-60 bg-slate-100 capitalize cursor-not-allowed`}
            />
          </div>

          <div>
            <label className={labelCls}>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="+880 1XXX XXX XXX"
              value={formData.phone}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <FiMapPin size={16} />
            </span>
            Address Details
          </h2>

          <div>
            <label className={labelCls}>Street Address</label>
            <input
              type="text"
              name="address_line1"
              placeholder="123 Studio Way"
              value={formData.address_line1}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Address Line 2 (Optional)</label>
            <input
              type="text"
              name="address_line2"
              placeholder="Suite 400"
              value={formData.address_line2}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input
                type="text"
                name="city"
                placeholder="Dhaka"
                value={formData.city}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>State / Region</label>
              <input
                type="text"
                name="state"
                placeholder="Dhaka Division"
                value={formData.state}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Bangladesh"
                value={formData.country}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Postal Code</label>
              <input
                type="text"
                name="postal_code"
                placeholder="1205"
                value={formData.postal_code}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            <FiSave size={16} />
            {loading ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
