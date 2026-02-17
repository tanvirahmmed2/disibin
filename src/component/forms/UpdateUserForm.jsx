'use client'
import axios from 'axios';
import React, { useState } from 'react'

const UpdateUserForm = ({ user }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address_line1: user?.address_line1 || '',
        address_line2: user?.address_line2 || '',
        city: user?.city || '',
        state: user?.state || '',
        postal_code: user?.postal_code || '',
        country: user?.country || 'Bangladesh',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch('/api/user/profile', {
                id: user.user_id,
                ...formData
            });
            alert(res.data.message);
        } catch (error) {
            alert(error?.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 border p-6 rounded-xl bg-white shadow-sm'>
            <h2 className='col-span-full text-xl font-bold border-b pb-2'>Account Information</h2>
            
            <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className='border p-2 rounded' required />
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className='border p-2 rounded' />
            </div>

            <h2 className='col-span-full text-xl font-bold border-b pb-2 mt-4'>Address Details</h2>

            <div className='flex flex-col gap-1 col-span-full'>
                <label className='text-sm font-semibold'>Address Line 1</label>
                <input name="address_line1" value={formData.address_line1} onChange={handleChange} className='border p-2 rounded' />
            </div>

            <div className='flex flex-col gap-1 col-span-full'>
                <label className='text-sm font-semibold'>Address Line 2</label>
                <input name="address_line2" value={formData.address_line2} onChange={handleChange} className='border p-2 rounded' />
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>City</label>
                <input name="city" value={formData.city} onChange={handleChange} className='border p-2 rounded' />
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>State / Division</label>
                <input name="state" value={formData.state} onChange={handleChange} className='border p-2 rounded' />
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Postal Code</label>
                <input name="postal_code" value={formData.postal_code} onChange={handleChange} className='border p-2 rounded' />
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-sm font-semibold'>Country</label>
                <input name="country" value={formData.country} onChange={handleChange} className='border p-2 rounded' />
            </div>

            <button type="submit" className='col-span-full mt-4 bg-emerald-600 text-white p-3 rounded font-bold hover:bg-emerald-700 transition-colors'>
                Update Profile
            </button>
        </form>
    );
};

export default UpdateUserForm