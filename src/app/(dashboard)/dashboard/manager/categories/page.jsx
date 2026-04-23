'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiPriceTag3Line } from 'react-icons/ri'
import toast from 'react-hot-toast'

const CategoryManagement = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/category')
            setCategories(res.data.data || [])
        } catch (error) {
            toast.error('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (currentCategory) {
                await axios.patch('/api/category', { id: currentCategory.category_id, ...formData })
                toast.success('Category updated')
            } else {
                await axios.post('/api/category', formData)
                toast.success('Category created')
            }
            setFormData({ name: '', description: '' })
            setCurrentCategory(null)
            setIsModalOpen(false)
            fetchCategories()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this category?')) return
        try {
            await axios.delete('/api/category', { data: { id } })
            toast.success('Category deleted')
            fetchCategories()
        } catch (error) {
            toast.error('Failed to delete category')
        }
    }

    const columns = [
        { label: 'Category', key: 'name', render: (row) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-slate-200">
                    <RiPriceTag3Line size={16} />
                </div>
                <div>
                    <p className="font-bold text-slate-800">{row.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Slug: {row.slug}</p>
                </div>
            </div>
        )},
        { label: 'Description', key: 'description', render: (row) => (
            <span className="text-xs text-slate-500 line-clamp-1 max-w-[300px]">{row.description || 'No description'}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => {
                    setCurrentCategory(row)
                    setFormData({ name: row.name, description: row.description || '' })
                    setIsModalOpen(true)
                }}
                className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all"
            >
                <RiEdit2Line size={18} />
            </button>
            <button 
                onClick={() => handleDelete(row.category_id)}
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
                    <h1 className="text-2xl font-bold text-slate-800">Category Repository</h1>
                    <p className="text-sm text-slate-500">Organize and classify platform content and services.</p>
                </div>
                <button 
                    onClick={() => {
                        setCurrentCategory(null)
                        setFormData({ name: '', description: '' })
                        setIsModalOpen(true)
                    }}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                >
                    <RiAddLine size={18} /> New Category
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={categories} loading={loading} actions={actions} />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{currentCategory ? 'Edit Category' : 'New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Web Development"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Brief description of this category..."
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
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
                                    {currentCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryManagement
