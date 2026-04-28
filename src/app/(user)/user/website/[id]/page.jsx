'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { 
    RiArrowLeftLine, 
    RiGlobalLine, 
    RiPaletteLine, 
    RiSeoLine, 
    RiBriefcaseLine,
    RiShareLine,
    RiSave3Line,
    RiSettings4Line,
    RiImageAddLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const UserWebsiteEditor = () => {
    const params = useParams()
    const router = useRouter()
    const websiteId = params.id
    
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        name: '',
        theme: '',
        business_name: '',
        logo: '',
        favicon: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        meta_title: '',
        meta_description: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        primary_color: '#10b981',
        secondary_color: '#0f172a',
        is_public: true,
        is_store_enabled: false
    })

    useEffect(() => {
        const fetchWebsite = async () => {
            try {
                // Fetch by website ID using the RESTful endpoint
                const res = await axios.get(`/api/website/${websiteId}`)
                if (res.data.success) {
                    const ws = res.data.data
                    setForm({
                        name: ws.name || '',
                        theme: ws.theme || 'default',
                        business_name: ws.business_name || '',
                        logo: ws.logo || '',
                        favicon: ws.favicon || '',
                        email: ws.email || '',
                        phone: ws.phone || '',
                        address: ws.address || '',
                        city: ws.city || '',
                        country: ws.country || '',
                        meta_title: ws.meta_title || '',
                        meta_description: ws.meta_description || '',
                        facebook: ws.facebook || '',
                        instagram: ws.instagram || '',
                        linkedin: ws.linkedin || '',
                        youtube: ws.youtube || '',
                        primary_color: ws.primary_color || '#10b981',
                        secondary_color: ws.secondary_color || '#0f172a',
                        is_public: ws.is_public ?? true,
                        is_store_enabled: ws.is_store_enabled ?? false
                    })
                }
            } catch (error) {
                toast.error('Failed to load website details')
                router.back()
            } finally {
                setLoading(false)
            }
        }
        if (websiteId) fetchWebsite()
    }, [websiteId, router])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await axios.patch(`/api/website/${websiteId}`, form)
            if (res.data.success) {
                toast.success('Website information updated successfully')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update website')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <RiArrowLeftLine size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Website Editor</h1>
                        <p className="text-slate-500 font-medium text-sm">Customize your brand and online presence.</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiSave3Line size={20} />}
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sidebar Navigation (Visual) */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Sections</h3>
                        <nav className="space-y-1">
                            <a href="#basic" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold transition-all">
                                <RiGlobalLine /> Basic Info
                            </a>
                            <a href="#branding" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all">
                                <RiPaletteLine /> Branding & UI
                            </a>
                            <a href="#seo" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all">
                                <RiSeoLine /> SEO Settings
                            </a>
                            <a href="#business" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all">
                                <RiBriefcaseLine /> Business Details
                            </a>
                            <a href="#social" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all">
                                <RiShareLine /> Social Media
                            </a>
                        </nav>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-lg relative overflow-hidden">
                        <RiSettings4Line size={100} className="absolute -bottom-4 -right-4 text-white/5" />
                        <h3 className="text-xl font-bold mb-2">Publishing</h3>
                        <p className="text-slate-400 text-sm mb-6">Manage visibility and e-commerce settings.</p>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                                <span className="font-bold text-sm">Public Visibility</span>
                                <input type="checkbox" checked={form.is_public} onChange={e => setForm({...form, is_public: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-transparent text-emerald-500 focus:ring-0" />
                            </label>
                            <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                                <span className="font-bold text-sm">Enable Store</span>
                                <input type="checkbox" checked={form.is_store_enabled} onChange={e => setForm({...form, is_store_enabled: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-transparent text-emerald-500 focus:ring-0" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Basic Info */}
                    <section id="basic" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <RiGlobalLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Project Name</label>
                                <input 
                                    value={form.name} 
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                    placeholder="e.g. My Awesome Startup"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Active Theme</label>
                                <select 
                                    value={form.theme} 
                                    onChange={e => setForm({...form, theme: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                >
                                    <option value="default">Disibin Default</option>
                                    <option value="minimal">Minimalist White</option>
                                    <option value="dark">Pro Dark</option>
                                    <option value="vibrant">Vibrant Colors</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Branding */}
                    <section id="branding" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <RiPaletteLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Branding & UI</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Logo URL</label>
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                                        {form.logo ? <img src={form.logo} className="w-full h-full object-contain" alt="Logo" /> : <RiImageAddLine className="text-slate-300" size={24} />}
                                    </div>
                                    <input 
                                        value={form.logo} 
                                        onChange={e => setForm({...form, logo: e.target.value})}
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium text-slate-600 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Colors</label>
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer" />
                                            <span className="text-xs font-bold text-slate-500">Primary</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={form.secondary_color} onChange={e => setForm({...form, secondary_color: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer" />
                                            <span className="text-xs font-bold text-slate-500">Secondary</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SEO Settings */}
                    <section id="seo" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                <RiSeoLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">SEO Settings</h2>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Meta Title</label>
                                <input 
                                    value={form.meta_title} 
                                    onChange={e => setForm({...form, meta_title: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                    placeholder="Search engine title"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Meta Description</label>
                                <textarea 
                                    value={form.meta_description} 
                                    onChange={e => setForm({...form, meta_description: e.target.value})}
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium text-slate-600 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all resize-none"
                                    placeholder="Short summary of your website for search results..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Business Details */}
                    <section id="business" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <RiBriefcaseLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Business Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Official Business Name</label>
                                <input 
                                    value={form.business_name} 
                                    onChange={e => setForm({...form, business_name: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Public Email</label>
                                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-emerald-400" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Public Phone</label>
                                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-emerald-400" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Full Address</label>
                                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-emerald-400" />
                            </div>
                        </div>
                    </section>

                    {/* Social Media */}
                    <section id="social" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                <RiShareLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Social Media Links</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['facebook', 'instagram', 'linkedin', 'youtube'].map((s) => (
                                <div key={s}>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">{s}</label>
                                    <input 
                                        value={form[s]} 
                                        onChange={e => setForm({...form, [s]: e.target.value})} 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-emerald-400 transition-all"
                                        placeholder={`https://${s}.com/...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}

export default UserWebsiteEditor
