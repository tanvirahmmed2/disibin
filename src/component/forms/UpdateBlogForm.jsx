'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RiSave3Line } from 'react-icons/ri'
import toast from 'react-hot-toast'

const UpdateBlogForm = ({ blogData }) => {
    const router = useRouter()
    
    const [formData, setFormData] = useState({
        id: blogData?.blog_id || '',
        title: blogData?.title || '',
        description: blogData?.description || '',
        image: null
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (files) {
            setFormData(prev => ({ ...prev, image: files[0] }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = new FormData()
            data.append('id', formData.id)
            data.append('title', formData.title)
            data.append('description', formData.description)
            
            if (formData.image) {
                data.append('image', formData.image)
            }

            const response = await axios.patch('/api/blog', data)
            
            if (response.data.success) {
                toast.success('Article updated successfully!')
                router.push('/dashboard/manager/blogs')
                router.refresh()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update article")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Title</label>
                <input 
                    type="text" 
                    name="title" 
                    required 
                    value={formData.title} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all" 
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Content / Description</label>
                <textarea 
                    name="description" 
                    required 
                    value={formData.description} 
                    onChange={handleChange}
                    rows={10}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all pt-4 leading-relaxed resize-none" 
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Update Featured Image (Optional)</label>
                <div className="relative group">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl px-4 py-8 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all cursor-pointer" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                        {formData.image ? formData.image.name : 'Click or drag to replace featured image'}
                    </div>
                </div>
            </div>

            <button 
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
                {loading ? 'Saving Changes...' : 'Commit Changes'}
            </button>
        </form>
    )
}

export default UpdateBlogForm