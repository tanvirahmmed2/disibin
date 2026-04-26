'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiTicketLine, RiImageAddLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import Image from 'next/image'

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([])
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentCoupon, setCurrentCoupon] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [formData, setFormData] = useState({
        package_id: '',
        code: '',
        discount: '',
        is_percentage: true,
        start_date: '',
        end_date: '',
        status: 'active',
        usage_limit: '',
        max_discount: '',
        image: null
    })

    const fetchCoupons = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/coupon')
            setCoupons(res.data.data || [])
        } catch (error) {
            toast.error('Failed to load coupons')
        } finally {
            setLoading(false)
        }
    }

    const fetchPackages = async () => {
        try {
            const res = await axios.get('/api/package')
            setPackages(res.data.data || [])
        } catch (error) {
            console.error('Failed to fetch packages', error)
        }
    }

    useEffect(() => {
        fetchCoupons()
        fetchPackages()
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, image: file })
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()

        // Explicitly append all fields, converting booleans to strings for FormData
        const textFields = ['package_id', 'code', 'discount', 'start_date', 'end_date', 'status', 'usage_limit', 'max_discount']
        textFields.forEach(key => {
            // Send empty string for nullable fields so the API can set them to null
            data.append(key, formData[key] ?? '')
        })
        data.append('is_percentage', formData.is_percentage ? 'true' : 'false')

        if (formData.image instanceof File) data.append('image', formData.image)
        if (currentCoupon) data.append('id', currentCoupon.coupon_id)

        try {
            if (currentCoupon) {
                await axios.patch('/api/coupon', data)
                toast.success('Coupon updated')
            } else {
                await axios.post('/api/coupon', data)
                toast.success('Coupon created')
            }
            setIsModalOpen(false)
            fetchCoupons()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this coupon?')) return
        try {
            await axios.delete('/api/coupon', { data: { id } })
            toast.success('Coupon deleted')
            fetchCoupons()
        } catch (error) {
            toast.error('Failed to delete coupon')
        }
    }

    const columns = [
        { label: 'Preview', key: 'image', render: (row) => (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {row.image ? (
                    <Image src={row.image} alt={row.code} fill className="object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                        <RiTicketLine size={20} />
                    </div>
                )}
            </div>
        )},
        { label: 'Code', key: 'code', render: (row) => (
            <div className="flex flex-col">
                <p className="font-bold text-slate-800">{row.code}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                    {row.package_name || 'Site-wide'}
                </p>
            </div>
        )},
        { label: 'Discount', key: 'discount', render: (row) => (
            <span className="font-bold text-emerald-600">
                {row.is_percentage ? `${row.discount}%` : `৳${row.discount}`}
            </span>
        )},
        { label: 'Duration', key: 'start_date', render: (row) => (
            <div className="flex flex-col text-[10px] text-slate-500 font-medium">
                <span>Starts: {row.start_date ? new Date(row.start_date).toLocaleDateString() : 'Now'}</span>
                <span>Ends: {row.end_date ? new Date(row.end_date).toLocaleDateString() : 'Never'}</span>
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest
                ${row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => {
                    setCurrentCoupon(row)
                    setImagePreview(row.image)
                    setFormData({
                        package_id: row.package_id || '',
                        code: row.code,
                        discount: row.discount,
                        is_percentage: row.is_percentage,
                        start_date: row.start_date?.split('T')[0] || '',
                        end_date: row.end_date?.split('T')[0] || '',
                        status: row.status,
                        usage_limit: row.usage_limit || '',
                        max_discount: row.max_discount || '',
                        image: null
                    })
                    setIsModalOpen(true)
                }}
                className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all"
            >
                <RiEdit2Line size={18} />
            </button>
            <button 
                onClick={() => handleDelete(row.coupon_id)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition-all"
            >
                <RiDeleteBin6Line size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-6 py-6 px-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800">Coupon Management</h1>
                    <p className="text-sm text-slate-500">Create and manage promotional discounts and offers with custom visuals.</p>
                </div>
                <button 
                    onClick={() => {
                        setCurrentCoupon(null)
                        setImagePreview(null)
                        setFormData({ package_id: '', code: '', discount: '', is_percentage: true, start_date: '', end_date: '', status: 'active', usage_limit: '', max_discount: '', image: null })
                        setIsModalOpen(true)
                    }}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                >
                    <RiAddLine size={18} /> New Coupon
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={coupons} loading={loading} actions={actions} />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh] no-scrollbar">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{currentCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="relative group cursor-pointer">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="image/*"
                                />
                                <div className={`aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                                    ${imagePreview ? 'border-emerald-500/20 bg-emerald-50/10' : 'border-slate-200 bg-slate-50 hover:border-emerald-500/40'}`}>
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                                                <RiImageAddLine size={24} />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Promotional Visual</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Coupon Code</label>
                                    <input 
                                        type="text" 
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                        placeholder="e.g. SAVE20"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Package</label>
                                    <select 
                                        value={formData.package_id}
                                        onChange={(e) => setFormData({...formData, package_id: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                    >
                                        <option value="">All Packages</option>
                                        {packages.map(pkg => (
                                            <option key={pkg.package_id} value={pkg.package_id}>{pkg.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Discount Value</label>
                                    <input 
                                        type="number" 
                                        value={formData.discount}
                                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                                        placeholder="e.g. 20"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.is_percentage}
                                            onChange={(e) => setFormData({...formData, is_percentage: e.target.checked})}
                                            className="w-5 h-5 rounded accent-emerald-500"
                                        />
                                        <span className="text-sm font-medium text-slate-600">{formData.is_percentage ? 'Percentage (%)' : 'Fixed (৳)'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">End Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Coupon Status</label>
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Usage Limit</label>
                                    <input 
                                        type="number" 
                                        value={formData.usage_limit}
                                        onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                                        placeholder="0 = unlimited"
                                        min="0"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Max Discount (৳)</label>
                                    <input 
                                        type="number" 
                                        value={formData.max_discount}
                                        onChange={(e) => setFormData({...formData, max_discount: e.target.value})}
                                        placeholder="Cap for % discounts"
                                        min="0"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10"
                                >
                                    {currentCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CouponManagement
