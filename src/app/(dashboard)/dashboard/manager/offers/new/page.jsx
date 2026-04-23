'use client'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Context } from '@/component/helper/Context'

const CreateOffer = () => {
    const { userData } = useContext(Context)
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discount: '',
        features: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = {
                ...formData,
                price: Number(formData.price),
                discount: Number(formData.discount) || 0,
                features: formData.features.split(',').filter(f => f.trim()),
                createdBy: userData?.user_id
            }
            const res = await axios.post('/api/offers', data, { withCredentials: true })
            if (res.data.success) {
                alert('Offer created successfully!')
                router.push('/dashboard/editor/offers')
            }
        } catch (error) {
            alert(error?.response?.data?.message || 'Failed to create offer')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-10 w-full">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Offer</h1>
                <p className="text-slate-500 font-medium">Design a new strategic opportunity for the catalog.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
                <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Offer Title</label>
                        <input 
                            type="text" name="title" required value={formData.title} onChange={handleChange}
                            className="input-standard"
                            
                        />
                    </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                    <textarea 
                        name="description" required value={formData.description} onChange={handleChange}
                        className="input-standard"
                       
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Base Price (BDT)</label>
                        <input 
                            type="number" name="price" required value={formData.price} onChange={handleChange}
                            className="input-standard"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Discount (Optional)</label>
                        <input 
                            type="number" name="discount" value={formData.discount} onChange={handleChange}
                            className="input-standard"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Features (One per line)</label>
                    <textarea 
                        name="features" required value={formData.features} onChange={handleChange}
                        className="input-standard"
                        
                    />
                </div>

                <div className="pt-6 flex justify-end">
                    <button 
                        disabled={loading}
                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Launch Offer'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateOffer
