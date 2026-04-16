'use client'
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { RiUserLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiFlagLine, RiSave3Line, RiLockPasswordLine } from 'react-icons/ri';
import { Context } from '@/component/helper/Context';

const SettingsPage = () => {
    const router = useRouter();
    const { isLoggedin, userData } = useContext(Context);
    
    const [saving, setSaving] = useState(false);
    
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        country: '',
        password: '',
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                city: userData.city || '',
                country: userData.country || '',
                password: '', 
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.password) {
                delete dataToSubmit.password; 
            }
            
            const res = await axios.patch('/api/user/update', dataToSubmit, { withCredentials: true });
            
            if (res.data.success) {
                alert('Settings updated successfully!');
                
                window.location.reload(); 
            } else {
                alert(res.data.message || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Update Error:', error);
            alert(error?.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (!userData) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
                <p className="text-slate-500">Manage your personal information, security, and preferences.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-100">
                        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-4xl font-black text-emerald-600 shrink-0 shadow-inner">
                            {userData.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <h3 className="font-bold text-slate-800 text-lg">Profile Avatar</h3>
                            <p className="text-slate-500 text-sm text-center md:text-left max-w-md">Currently avatars are derived from your name. Future updates will allow custom image uploads.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    <RiUserLine size={20} />
                                </div>
                                <input 
                                    type="text" name="name" value={formData.name} onChange={handleChange} required 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium text-slate-800" 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Email Address <span className="font-normal text-slate-400">(Read-Only)</span></label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                    <RiMailLine size={20} />
                                </div>
                                <input 
                                    type="email" value={userData.email || ''} disabled
                                    className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border-2 border-slate-100 rounded-xl outline-none font-medium text-slate-500 cursor-not-allowed" 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    <RiPhoneLine size={20} />
                                </div>
                                <input 
                                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-bold text-slate-700 text-rose-500">New Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-rose-400 group-focus-within:text-rose-500 transition-colors">
                                    <RiLockPasswordLine size={20} />
                                </div>
                                <input 
                                    type="password" name="password" value={formData.password} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-rose-50/30 border-2 border-rose-100 rounded-xl outline-none focus:bg-white focus:border-rose-500 transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">City</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    <RiMapPinLine size={20} />
                                </div>
                                <input 
                                    type="text" name="city" value={formData.city} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Country</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    <RiFlagLine size={20} />
                                </div>
                                <input 
                                    type="text" name="country" value={formData.country} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                            type="submit" disabled={saving}
                            className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:scale-100 min-w-[200px]"
                        >
                            {saving ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <RiSave3Line size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
