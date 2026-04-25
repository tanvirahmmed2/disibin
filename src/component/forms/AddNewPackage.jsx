'use client'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const AddNewPackage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    features: '',
    categoryId: '',
    durationDays: 30
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
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
    const { name, value, files } = e.target
    if (files) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key])
      })
      const response = await axios.post('/api/package', data)
      toast.success('Package created successfully')
      setFormData({
        title: '',
        description: '',
        price: '',
        image: null,
        features: '',
        categoryId: '',
        durationDays: 30
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add new package")
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
            placeholder="e.g. Premium SEO Pack"
            className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
          />
        </div>
        <div className='space-y-2'>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (৳)</label>
          <input 
            type="number" 
            min={0} 
            name='price' 
            required 
            onChange={handleChange} 
            value={formData.price} 
            placeholder="e.g. 199"
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
          placeholder="Detailed description of what's included..."
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
          placeholder="e.g. 24/7 Support, Weekly Reports, API Access"
          className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
        />
      </div>

      <div className='space-y-2'>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Package Image</label>
        <div className="relative group">
          <input 
            type="file" 
            accept='image/*' 
            required 
            name='image' 
            onChange={handleChange} 
            className='w-full bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl px-4 py-8 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all cursor-pointer' 
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
            {formData.image ? formData.image.name : 'Click or drag to upload package image'}
          </div>
        </div>
      </div>

      <button 
        disabled={loading}
        className='w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none' 
        type='submit'
      >
        {loading ? 'Creating...' : 'Create Package'}
      </button>
    </form>
  )
}

export default AddNewPackage
