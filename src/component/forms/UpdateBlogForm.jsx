'use client'
import axios from 'axios';
import React, { useState } from 'react'

const UpdateBlogForm = ({ blog }) => {
    const [formData, setFormData] = useState({
        title: blog?.title || '',
        description: blog?.description || '',
        preview: blog?.preview || '',
        tags: blog?.tags?.join(', ') || '', 
        is_featured: blog?.is_featured || false,
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
            data.append('id', blog.blog_id);
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('preview', formData.preview);
            data.append('is_featured', formData.is_featured);
            
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
            data.append('tags', JSON.stringify(tagsArray));
            
            if (image) data.append('image', image);

            const res = await axios.patch('/api/blog', data);
            alert(res.data.message);
        } catch (error) {
            alert(error?.response?.data?.message || "Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4'>
            <div className='flex flex-col gap-1 w-full'>
                <label className='font-bold text-gray-700'>Blog Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600/30' required />
            </div>

            <div className='flex flex-col gap-1 w-full'>
                <label className='font-bold text-gray-700'>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600/30' required />
            </div>

            <div className='flex flex-col w-full gap-1'>
                <label className='font-bold text-gray-700'>Preview Link</label>
                <input name="preview" value={formData.preview} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600/30' />
            </div>

            <div className='flex flex-col w-full gap-1'>
                <label className='font-bold text-gray-700'>Tags</label>
                <input name="tags" value={formData.tags} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600/30' />
            </div>

            <div className='flex items-center gap-2 py-2'>
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} id="featured-blog" className='w-full px-3 p-1 outline-none border border-emerald-600/30' />
                <label htmlFor="featured-blog" className='font-bold text-gray-700'>Feature this blog</label>
            </div>

            <div className='flex flex-col w-full gap-1 border-t pt-4'>
                <label className='font-bold text-gray-700'>Change Cover Image</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className='w-full px-3 p-1 outline-none border border-emerald-600/30' />
            </div>

            <button type="submit" className='bg-emerald-600 text-white p-3 rounded-md hover:bg-emerald-700 font-bold transition-colors'>
                Update Blog Post
            </button>
        </form>
    )
}

export default UpdateBlogForm;