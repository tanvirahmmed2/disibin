'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { 
    RiGlobalLine, 
    RiArrowRightLine,
    RiExternalLinkLine,
    RiShieldFlashLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const MyWebsites = () => {
    const router = useRouter()
    const [websites, setWebsites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                // Fetch all websites belonging to the current user
                const res = await axios.get('/api/website')
                if (res.data.success) {
                    setWebsites(res.data.data)
                }
            } catch (error) {
                toast.error('Failed to load projects')
            } finally {
                setLoading(false)
            }
        }
        fetchWebsites()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto space-y-10 py-8 px-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Projects</h1>
                <p className="text-slate-500 font-medium">Manage and customize your live websites and development projects.</p>
            </div>

            {websites.length === 0 ? (
                <div className="bg-white p-20 rounded-[2rem] border border-dashed border-slate-200 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                        <RiGlobalLine size={40} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-800">No projects found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto text-sm">You haven't activated any services yet. Purchase a package to get started.</p>
                    </div>
                    <button 
                        onClick={() => router.push('/services')}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-900/10"
                    >
                        Browse Packages
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites.map((site) => (
                        <div key={site.website_id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group flex flex-col justify-between h-full">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm">
                                        <RiGlobalLine size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                                        ${site.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                        {site.status}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{site.name || 'Untitled Project'}</h3>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <RiExternalLinkLine size={14} />
                                        <p className="text-xs font-bold truncate">{site.domain || 'no-domain-linked'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
                                </div>
                                <button 
                                    onClick={() => router.push(`/user/website/${site.website_id}`)}
                                    className="flex items-center gap-2 p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                                >
                                    <span className="text-xs font-bold ml-2">Edit Site</span>
                                    <RiArrowRightLine size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyWebsites
