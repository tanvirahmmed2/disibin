'use client'
import axios from 'axios';
import React, { useState } from 'react'

const UpdatePackageForm = ({ pack }) => {
    const [formData, setFormData] = useState({
        title: pack?.title || '',
        description: pack?.description || '',
        price: pack?.price || '',
        discount: pack?.discount || '',
        category: pack?.category || '',
        features: pack?.features?.join(', ') || '',
        is_popular: pack?.is_popular || false,
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
        data.append('id', pack.package_id);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('discount', formData.discount);
        data.append('category', formData.category);
        data.append('is_popular', formData.is_popular);
        
        data.append('features', formData.features); 
        
        if (image) data.append('image', image);

        const res = await axios.patch('/api/package', data);
        alert(res.data.message);
    } catch (error) {
        alert(error?.response?.data?.message || "Update failed");
    }
};

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
         
            <div className='flex flex-col gap-1 w-full'>
                <label className='font-bold text-gray-700'>Package Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className='w-full px-3 p-1 border border-emerald-600/30 outline-none' required />
            </div>

            <div className='flex flex-col gap-1 w-full'>
                <label className='font-bold text-gray-700'>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className='w-full px-3 p-1 border border-emerald-600/30 outline-none' required />
            </div>

            <div className='w-full flex flex-col md:flex-row items-center justify-between gap-3'>
                <div className='flex flex-col gap-1 w-full'>
                    <label className='font-bold text-gray-700'>Price</label>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} className='w-full px-3 p-1 border border-emerald-600/30 outline-none' required />
                </div>
                <div className='flex flex-col gap-1 w-full'>
                    <label className='font-bold text-gray-700'>Discount</label>
                    <input name="discount" type="number" value={formData.discount} onChange={handleChange} className='w-full px-3 p-1 border border-emerald-600/30 outline-none'/>
                </div>
            </div>

            <div className='flex flex-col gap-1 w-full'>
                <label className='font-bold text-gray-700'>Category</label>
                <input name="category" value={formData.category} onChange={handleChange} className='w-full px-3 p-1 border border-emerald-600/30 outline-none' required />
            </div>

            <div className='flex flex-col gap-1 w-full'>
                <label className='font-bold text-gray-700'>Features (comma separated)</label>
                <input name="features" value={formData.features} onChange={handleChange} className='w-full px-3 p-1 border border-emerald-600/30 outline-none' />
            </div>

            <div className='flex items-center gap-2 py-2'>
                <input type="checkbox" name="is_popular" checked={formData.is_popular} onChange={handleChange} id="popular-package" className='w-5 h-5 accent-emerald-600' />
                <label htmlFor="popular-package" className='font-bold text-gray-700'>Mark as Popular</label>
            </div>

            <div className='flex flex-col gap-1 w-full border-t pt-4'>
                <label className='font-bold text-gray-700'>Update Image</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className='w-full px-3 p-1 border border-emerald-600/30 outline-none' />
            </div>

            <button type="submit" className='bg-emerald-600 text-white p-3 rounded-md hover:bg-emerald-700 font-bold transition-colors'>
                Update Package
            </button>
        </form>
    )
}

export default UpdatePackageForm;