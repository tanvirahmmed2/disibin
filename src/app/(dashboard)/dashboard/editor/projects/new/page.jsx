'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RiArrowLeftLine, RiSaveLine, RiImageAddLine } from 'react-icons/ri'
import Link from 'next/link'
import Image from 'next/image'

const NewProject = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        preview: '' 
    })
    const [image, setImage] = useState(null)
    const [imgPreview, setImgPreview] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImgPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('category', formData.category)
            data.append('preview', formData.preview)
            
            if (image) data.append('image', image)

            const res = await axios.post('/api/project', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (res.data.success) {
                alert('Project created successfully!')
                router.push('/dashboard/editor/projects')
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create project')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full mx-auto space-y-8 pb-20">
            <Link href="/dashboard/editor/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-all">
                <RiArrowLeftLine />
                <span>Back to Projects</span>
            </Link>

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create New Project</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 ml-1">Project Title</span>
                            <input 
                                type="text" name="title" required
                                value={formData.title} onChange={handleChange}
                                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </label>
                        
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 ml-1">Category</span>
                            <input 
                                type="text" name="category" required
                                value={formData.category} onChange={handleChange}
                                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative group transition-all hover:border-primary/30">
                        {imgPreview ? (
                            <Image src={imgPreview} alt="Preview" fill className="object-cover rounded-xl" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-primary/50">
                                <RiImageAddLine size={48} />
                                <span className="font-bold">Upload Project Image</span>
                            </div>
                        )}
                        <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Live Preview URL</span>
                    <input 
                        type="url" name="preview" required
                        value={formData.preview} onChange={handleChange}
                        className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Description</span>
                    <textarea 
                        name="description" required rows="4"
                        value={formData.description} onChange={handleChange}
                        className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                    ></textarea>
                </label>

                <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-primary text-white py-5 rounded-xl font-black text-lg shadow-xl shadow-primary/10 hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <RiSaveLine size={24} />
                    {loading ? 'Creating...' : 'Create Project'}
                </button>
            </form>
        </div>
    )
}

export default NewProject