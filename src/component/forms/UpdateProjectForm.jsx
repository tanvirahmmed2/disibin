'use client'
import axios from 'axios';
import React, { useState } from 'react'

const UpdateProjectForm = ({ project }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        category: project?.category || '',
        description: project?.description || '',
        preview: project?.preview || '',
    });
    
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

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
            
            data.append('id', project._id); 
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('preview', formData.preview);
            
            if (image) data.append('image', image);

            const res = await axios.patch('/api/project', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert('Project updated successfully!');
            }
        } catch (error) {
            alert(error?.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-5'>
            <div className='flex flex-col w-full gap-1'>
                <label className='text-sm font-bold text-slate-700 ml-1'>Project Title</label>
                <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    className='w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/50 transition-all' 
                    required 
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col w-full gap-1'>
                    <label className='text-sm font-bold text-slate-700 ml-1'>Category</label>
                    <input 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/50' 
                        required
                    />
                </div>
                <div className='flex flex-col w-full gap-1'>
                    <label className='text-sm font-bold text-slate-700 ml-1'>Preview Link (Demo URL)</label>
                    <input 
                        name="preview" 
                        value={formData.preview} 
                        onChange={handleChange} 
                        className='w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/50' 
                        required
                    />
                </div>
            </div>

            <div className='flex flex-col w-full gap-1'>
                <label className='text-sm font-bold text-slate-700 ml-1'>Description</label>
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="5"
                    className='w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/50 resize-none' 
                    required 
                />
            </div>

            <div className='flex flex-col w-full gap-1'>
                <label className='text-sm font-bold text-slate-700 ml-1'>Replace Image (Optional)</label>
                <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    className='w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary' 
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className='bg-primary text-white py-4 rounded-xl hover:bg-primary-dark font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50'
            >
                {loading ? 'Saving Changes...' : 'Update Project Details'}
            </button>
        </form>
    )
}

export default UpdateProjectForm;