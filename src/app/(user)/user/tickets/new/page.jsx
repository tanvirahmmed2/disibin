'use client'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { RiSendPlane2Line, RiArrowLeftLine, RiInformationLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const NewTicket = () => {
    const router = useRouter()
    const { userData } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        subject: '',
        category: 'General Support',
        priority: 'medium',
        message: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.subject || !formData.message) {
            return toast.error('Required fields missing.')
        }

        setLoading(true)
        try {
            const res = await axios.post('/api/ticket', formData)
            if (res.data.success) {
                toast.success('Ticket created.')
                router.push(`/user/tickets/${res.data.data.ticket_id}`)
            }
        } catch (error) {
            toast.error('Failed to create ticket.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500">
                    <RiArrowLeftLine size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Open New Ticket</h1>
                    <p className="text-sm text-slate-500">Provide details about your inquiry.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                            <input 
                                type="text" 
                                placeholder="What is this regarding?"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                required
                                className="input-standard" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="input-standard appearance-none cursor-pointer"
                            >
                                <option>General Support</option>
                                <option>Technical Issue</option>
                                <option>Billing & Access</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                        <div className="flex gap-4">
                            {['low', 'medium', 'urgent'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setFormData({...formData, priority: p})}
                                    className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] transition-all border
                                        ${formData.priority === p 
                                            ? 'bg-emerald-500 text-white border-emerald-500' 
                                            : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-200'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                        <textarea 
                            placeholder="Describe your issue in detail..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            required
                            className="input-standard h-40 resize-none py-4" 
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                            type="submit" disabled={loading}
                            className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all disabled:opacity-70"
                        >
                            {loading ? 'Processing...' : 'Submit Ticket'} <RiSendPlane2Line />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewTicket
