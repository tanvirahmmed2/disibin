'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { RiShieldUserLine, RiSendPlane2Line, RiErrorWarningLine } from 'react-icons/ri'

const AdminRoles = () => {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('manager')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handlePromote = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        try {
            const res = await axios.patch('/api/user/promote', { email, role })
            if (res.data.success) {
                setMessage({ type: 'success', text: res.data.message })
                setEmail('')
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update role' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl space-y-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Role Management</h1>
                <p className="text-slate-500 font-medium">Promote users by email and adjust system permissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-premium p-10 space-y-8 bg-white">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <RiShieldUserLine size={24} />
                    </div>
                    
                    <form onSubmit={handlePromote} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">User Email</label>
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-standard"
                                placeholder="Enter user's registered email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Assign User Role</label>
                            <select 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="input-standard cursor-pointer"
                            >
                                <option value="admin">Administrator</option>
                                <option value="manager">Manager</option>
                                <option value="support">Support Agent</option>
                                <option value="developer">Developer</option>
                                <option value="user">Standard User</option>
                            </select>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                                message.type === 'success' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-emerald-500 text-emerald-500 border-emerald-500'
                            }`}>
                                <RiErrorWarningLine size={16} /> {message.text}
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-900/10"
                        >
                            {loading ? 'Processing...' : <><RiSendPlane2Line size={18} /> Update Access</>}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                   <div className="card-premium p-10 bg-white border-white text-white">
                        <div className="flex gap-4">
                            <RiErrorWarningLine size={24} className="shrink-0" />
                            <div className="space-y-2">
                                <h4 className="font-black uppercase tracking-tighter">Security Protocol</h4>
                                <p className="text-xs font-medium leading-relaxed opacity-80">
                                    Promoting a user to **Administrator** grants them full system control. 
                                    The system automatically prevents the removal of the last administrator to ensure technical continuity.
                                </p>
                            </div>
                        </div>
                   </div>
                   
                   <div className="card-premium p-10 border-slate-100">
                        <h4 className="font-black text-slate-800 uppercase tracking-tighter mb-4">Role Hierarchy</h4>
                        <div className="space-y-4">
                            {[
                                { r: 'Admin', d: 'Root access, Financials, User Ops' },
                                { r: 'Manager', d: 'Team Lead, Client oversight' },
                                { r: 'Staff', d: 'Task completion & delivery' }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="text-emerald-500">{item.r}</span>
                                    <span className="text-slate-400">{item.d}</span>
                                </div>
                            ))}
                        </div>
                   </div>
                </div>
            </div>
        </div>
    )
}

export default AdminRoles
