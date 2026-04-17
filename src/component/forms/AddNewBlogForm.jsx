'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AddNewBlogForm = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
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
            data.append('tags', formData.tags)

            if (formData.image) {
                data.append('image', formData.image)
            }

            const response = await axios.post('/api/blog', data)

            if (response.data.success) {
                alert('Blog published successfully!')
                router.push('/dashboard/editor/blogs')
            }
        } catch (error) {
            alert(error?.response?.data?.message || "Failed to publish article")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Article Title</label>
                <input
                    type="text" name="title" required
                    value={formData.title} onChange={handleChange}
                    className="w-full px-3 p-2 rounded-lg border outline-none border-emerald-400/50 "
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tags (comma separated)</label>
                <input
                    type="text" name="tags"
                    placeholder="e.g. Technology, Coding, JavaScript"
                    value={formData.tags} onChange={handleChange}
                    className="w-full px-3 p-2 rounded-lg border outline-none border-emerald-400/50 "
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Article Description</label>
                <textarea
                    name="description" required
                    value={formData.description} onChange={handleChange}
                    className="w-full px-3 p-2 rounded-lg border outline-none border-emerald-400/50 "
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Featured Image</label>
                <input
                    type="file" accept="image/*" required onChange={handleChange}
                    className="w-full px-3 p-2 rounded-lg border outline-none border-emerald-400/50 " />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                    disabled={loading}
                    className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Publishing...' : 'Publish Article'}
                </button>
            </div>
        </form>
    )
}

export default AddNewBlogForm