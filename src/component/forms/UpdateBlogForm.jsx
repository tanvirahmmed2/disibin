'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RiSave3Line } from 'react-icons/ri'
import toast from 'react-hot-toast'

const UpdateBlogForm = ({ blog }) => {
    const router = useRouter()
    
    const [formData, setFormData] = useState({
        id: blog?.blog_id || '',
        title: blog?.title || '',
        description: blog?.description || '',
        tags: blog?.tags?.join(', ') || '',  
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
            data.append('tags', formData.tags) 
            
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Article Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        required 
                        value={formData.title} 
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Tags (comma separated)</label>
                    <input 
                        type="text" 
                        name="tags" 
                        value={formData.tags} 
                        onChange={handleChange}
                        placeholder="Coding, Tech, React"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Article Description</label>
                <textarea 
                    name="description" 
                    required 
                    value={formData.description} 
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500/20 outline-none h-80 pt-4 leading-relaxed resize-none" 
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                    Update Cover Image <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white hover:file:bg-emerald-500 transition-all cursor-pointer" 
                />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                    disabled={loading}
                    className="flex items-center gap-2 px-12 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-500/20 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <RiSave3Line size={18} />
                            Commit Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default UpdateBlogForm