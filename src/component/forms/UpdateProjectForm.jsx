'use client'
import axios from 'axios';
import React, { useState } from 'react'

const UpdateProjectForm = ({ project }) => {
    
    const [formData, setFormData] = useState({
        title: project?.title || '',
        category: project?.category || '',
        description: project?.description || '',
        preview: project?.preview || '',
        
        tags: project?.tags?.join(', ') || '',
        skills: project?.skills?.join(', ') || '',
        is_featured: project?.is_featured || false,
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('id', project.project_id);
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('preview', formData.preview);
            data.append('is_featured', formData.is_featured);
            
            data.append('tags', JSON.stringify(formData.tags.split(',').map(item => item.trim())));
            data.append('skills', JSON.stringify(formData.skills.split(',').map(item => item.trim())));
            
            if (image) data.append('image', image);

            const res = await axios.patch('/api/project', data);
            alert(res.data.message);
        } catch (error) {
            alert(error?.response?.data?.message || "Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-3 items-center'>
            <div className='flex flex-col w-full'>
                <label className='font-semibold'>Project Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className='w-full px-3 p-1 border border-primary/30 outline-none ' required />
            </div>

            <div className='flex flex-col w-full'>
                <label className='font-semibold'>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className='w-full px-3 p-1 border border-primary/30 outline-none ' required />
            </div>

            <div className='w-full flex flex-col md:flex-row items-center justify-between gap-2'>
                <div className='flex flex-col w-full'>
                    <label className='font-semibold'>Category</label>
                    <input name="category" value={formData.category} onChange={handleChange} className='w-full px-3 p-1 border border-primary/30 outline-none ' />
                </div>
                <div className='flex flex-col w-full'>
                    <label className='font-semibold'>Preview Link</label>
                    <input name="preview" value={formData.preview} onChange={handleChange} className='w-full px-3 p-1 border border-primary/30 outline-none ' />
                </div>
            </div>

            <div className='flex flex-col w-full'>
                <label className='font-semibold'>Tags (comma separated)</label>
                <input name="tags" value={formData.tags} onChange={handleChange} className='w-full px-3 p-1 border border-primary/30 outline-none ' />
            </div>

            <div className='flex flex-col w-full'>
                <label className='font-semibold'>Skills (comma separated)</label>
                <input name="skills" value={formData.skills} onChange={handleChange} className='w-full px-3 p-1 border border-primary/30 outline-none ' />
            </div>

            <div className='flex items-center gap-2'>
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} id="featured" />
                <label htmlFor="featured" className='font-semibold'>Featured Project</label>
            </div>

            <div className='flex flex-col w-full'>
                <label className='font-semibold'>Update Image (Leave blank to keep current)</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className='w-full px-3 p-1 border border-primary/30 outline-none ' />
            </div>

            <button type="submit" className='bg-primary text-white p-2 rounded hover:bg-primary-dark font-bold'>
                Update Project
            </button>
        </form>
    )
}

export default UpdateProjectForm;
