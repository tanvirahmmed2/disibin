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
                <div className="w-8 h-8 border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs">
                    <RiPriceTag3Line size={12} />
                </div>
                <div>
                    <p className="font-bold text-slate-900 uppercase tracking-tight text-xs leading-none mb-1">{row.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Slug: {row.slug}</p>
                </div>
            </div>
        )},
        { label: 'Description', key: 'description', render: (row) => (
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest line-clamp-1 max-w-[300px]">{row.description || 'N/A'}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1">
            <button 
                onClick={() => {
                    setCurrentCategory(row)
                    setFormData({ name: row.name, description: row.description || '' })
                    setIsModalOpen(true)
                }}
                className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
                title="Edit"
            >
                <RiEdit2Line size={16} />
            </button>
            <button 
                onClick={() => handleDelete(row.category_id)}
                className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                title="Delete"
            >
                <RiDeleteBin6Line size={16} />
            </button>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Categories</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Classify platform content.</p>
                </div>
                <button 
                    onClick={() => {
                        setCurrentCategory(null)
                        setFormData({ name: '', description: '' })
                        setIsModalOpen(true)
                    }}
                    className="bg-slate-900 text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <RiAddLine size={16} /> New Category
                </button>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={categories} loading={loading} actions={actions} />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg p-8 border border-slate-200">
                        <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
                            {currentCategory ? 'Edit Category' : 'New Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-2 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all"
                                >
                                    {currentCategory ? 'Save Changes' : 'Create'}
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
