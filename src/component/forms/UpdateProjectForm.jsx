'use client'
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const UpdateProjectForm = ({ projectData }) => {
    const [formData, setFormData] = useState({
        title: projectData?.title || '',
        categoryId: projectData?.category_id || '',
        description: projectData?.description || '',
        preview: projectData?.live_url || '',
    });
    
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            
            data.append('id', projectData.project_id); 
            data.append('title', formData.title);
            data.append('categoryId', formData.categoryId);
            data.append('description', formData.description);
            data.append('preview', formData.preview);
            
            if (image) data.append('image', image);

            const res = await axios.patch('/api/project', data);

            if (res.data.success) {
                toast.success('Project updated successfully!');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
                        required 
                    />
                </div>
                <div className='space-y-2'>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Live URL (Preview)</label>
                    <input 
                        type="url" 
                        name="preview" 
                        value={formData.preview} 
                        onChange={handleChange} 
                        className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all' 
                        required 
                    />
                </div>
            </div>

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
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Description</label>
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={4}
                    className='w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all'
                    required 
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
                        {image ? image.name : 'Click or drag to replace cover image'}
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className='w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none' 
            >
                {loading ? 'Saving Changes...' : 'Update Project Details'}
            </button>
        </form>
    )
}

export default UpdateProjectForm;