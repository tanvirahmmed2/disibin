'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const AddNewBlogForm = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
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
            data.append('title', formData.title)
            data.append('description', formData.description)

            if (formData.image) {
                data.append('image', formData.image)
            }

            const response = await axios.post('/api/blog', data)

            if (response.data.success) {
                toast.success('Blog published successfully!')
                router.push('/dashboard/manager/blogs')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to publish article")
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
                    placeholder="e.g. The Future of SaaS Development"
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
                    placeholder="Write your article content here..."
                    rows={10}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Featured Image</label>
                <div className="relative group">
                    <input 
                        type="file" 
                        accept="image/*" 
                        required 
                        onChange={handleChange}
                        className="w-full bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl px-4 py-8 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all cursor-pointer" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                        {formData.image ? formData.image.name : 'Click or drag to upload featured image'}
                    </div>
                </div>
            </div>

            <button
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
                {loading ? 'Publishing...' : 'Publish Article'}
            </button>
        </form>
    )
}

export default AddNewBlogForm