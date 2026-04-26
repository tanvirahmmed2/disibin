'use client'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const UpdatePackageForm = ({ packageData }) => {
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        title: packageData?.name || '',
        description: packageData?.description || '',
        price: packageData?.price || '',
        categoryId: packageData?.category_id || '',
        features: packageData?.features?.map(f => typeof f === 'object' ? f.name : f).join(', ') || '',
        durationDays: packageData?.duration_days || 30
    })

    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/category')
                setCategories(res.data.data || [])
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()

            data.append('id', packageData.package_id)
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('price', Number(formData.price))
            data.append('categoryId', formData.categoryId)
            data.append('durationDays', Number(formData.durationDays))

            const featuresArray = formData.features
                .split(',')
                .map(f => f.trim())
                .filter(Boolean)

            data.append('features', featuresArray.join(','))

            if (image) {
                data.append('image', image)
            }

            const res = await axios.patch('/api/package', data)

            if (res.data.success) {
                toast.success('Package updated successfully')
            } else {
                toast.error(res.data.message || 'Update failed')
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Package Name</label>
                    <input 
                        type="text" 
                        name='title' 
                        required 
                        value={formData.title} 
                        onChange={handleChange} 
                        className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
                    />
                </div>
                <div className='space-y-2'>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price ($)</label>
                    <input 
                        type="number" 
                        min={0} 
                        name='price' 
                        required 
                        onChange={handleChange} 
                        value={formData.price} 
                        className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select 
                        name='categoryId' 
                        value={formData.categoryId} 
                        onChange={handleChange}
                        required
                        className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all'
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className='space-y-2'>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration (Days)</label>
                    <input 
                        type="number" 
                        name='durationDays' 
                        required 
                        min={1}
                        value={formData.durationDays} 
                        onChange={handleChange} 
                        className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
                    />
                </div>
            </div>

            <div className='space-y-2'>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Package Description</label>
                <textarea 
                    name="description" 
                    required 
                    onChange={handleChange} 
                    value={formData.description} 
                    rows={4}
                    className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all'
                ></textarea>
            </div>

            <div className='space-y-2'>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Features (comma separated)</label>
                <input 
                    type="text" 
                    name='features' 
                    required 
                    onChange={handleChange} 
                    value={formData.features} 
                    className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
                />
            </div>

            <div className='space-y-2'>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Update Image (Optional)</label>
                <div className="relative group">
                    <input 
                        type="file" 
                        accept='image/*' 
                        onChange={(e) => setImage(e.target.files[0])} 
                        className='w-full bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl px-4 py-8 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all cursor-pointer' 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                        {image ? image.name : 'Click or drag to replace package image'}
                    </div>
                </div>
            </div>

            <button 
                disabled={loading}
                className='w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none' 
                type='submit'
            >
                {loading ? 'Updating...' : 'Update Package'}
            </button>
        </form>
    )
}

export default UpdatePackageForm