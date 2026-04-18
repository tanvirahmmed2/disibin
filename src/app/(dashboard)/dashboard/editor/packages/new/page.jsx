'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RiArrowLeftLine, RiSaveLine, RiImageAddLine } from 'react-icons/ri'
import Link from 'next/link'
import Image from 'next/image'

const NewMembership = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        price: '',
        discount: '',
        duration: '',
        features: ''
    })
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('code', formData.code)
            data.append('description', formData.description)
            data.append('price', formData.price)
            data.append('discount', formData.discount)
            data.append('duration', formData.duration)
            
            
            const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f)
            data.append('features', JSON.stringify(featuresArray))
            
            if (image) data.append('image', image)

            const res = await axios.post('/api/membership', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (res.data.success) {
                alert('Membership plan created!')
                router.push('/dashboard/editor/memberships')
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create membership')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link href="/dashboard/editor/memberships" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-all">
                <RiArrowLeftLine />
                <span>Back to Plans</span>
            </Link>

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create New Plan</h1>
                <p className="text-slate-500">Define the tier, features, and pricing for this membership.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 ml-1">Plan Title</span>
                            <input 
                                type="text" name="title" required
                                value={formData.title} onChange={handleChange}
                                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 ml-1">Plan Code</span>
                            <input 
                                type="text" name="code" required
                                value={formData.code} onChange={handleChange}
                                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 ml-1">Duration</span>
                            <input 
                                type="text" name="duration" required
                                value={formData.duration} onChange={handleChange}
                                className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            />
                        </label>
                    </div>

                    
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative group transition-all hover:border-primary/30">
                        {preview ? (
                            <Image width={1000} height={1000} src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-primary/50">
                                <RiImageAddLine size={48} />
                                <span className="font-bold">Upload Plan Icon</span>
                            </div>
                        )}
                        <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 ml-1">Price ($)</span>
                        <input 
                            type="number" name="price" required
                            value={formData.price} onChange={handleChange}
                            className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 ml-1">Discount ($)</span>
                        <input 
                            type="number" name="discount"
                            value={formData.discount} onChange={handleChange}
                            className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                    </label>
                </div>

                <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Key Features (comma separated)</span>
                    <textarea 
                        name="features" required rows="3"
                        value={formData.features} onChange={handleChange}
                        className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                    ></textarea>
                </label>

                <label className="block">
                    <span className="text-sm font-bold text-slate-700 ml-1">Short Description</span>
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
                    {loading ? 'Creating...' : 'Create Membership Plan'}
                </button>
            </form>
        </div>
    )
}

export default NewMembership
