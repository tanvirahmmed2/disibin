'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { 
    RiSearch2Line, 
    RiUserLine, 
    RiInboxLine, 
    RiMoneyDollarBoxLine, 
    RiShieldStarLine, 
    RiServerLine,
    RiMailLine,
    RiPhoneLine,
    RiMapPinLine,
    RiCheckDoubleLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const DataHubPage = () => {
    const router = useRouter()
    const [searchEmail, setSearchEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState(null)

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchEmail.trim()) return

        setLoading(true)
        setUserData(null)
        try {
            const res = await axios.get(`/api/user/search?email=${encodeURIComponent(searchEmail.trim())}`)
            setUserData(res.data.data)
            toast.success('User found!')
        } catch (error) {
            toast.error(error.response?.data?.message || 'User not found')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Data Hub</h1>
                <p className="text-slate-500 font-medium">Search across the platform to view a full 360-degree user profile.</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                <div className="pl-4 pr-2 text-slate-400">
                    <RiSearch2Line size={24} />
                </div>
                <input 
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Enter user email address..."
                    className="flex-1 bg-transparent border-none p-3 text-slate-700 font-medium focus:outline-none focus:ring-0 placeholder:text-slate-300"
                    required
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* Results Area */}
            {userData && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Profile Overview */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white shadow-xl flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                            <RiUserLine size={48} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <h2 className="text-3xl font-black">{userData.profile.name || 'No Name'}</h2>
                                    {userData.profile.is_verified && <RiCheckDoubleLine className="text-emerald-400" size={24} title="Verified" />}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start text-sm font-medium text-slate-300">
                                    <span className="flex items-center gap-1"><RiMailLine /> {userData.profile.email}</span>
                                    {userData.profile.phone && <span className="flex items-center gap-1"><RiPhoneLine /> {userData.profile.phone}</span>}
                                    {userData.profile.country && <span className="flex items-center gap-1"><RiMapPinLine /> {userData.profile.city ? `${userData.profile.city}, ` : ''}{userData.profile.country}</span>}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold tracking-widest uppercase text-emerald-400">Role: {userData.profile.role}</span>
                                <span className={`px-3 py-1 bg-white/10 rounded-lg text-xs font-bold tracking-widest uppercase ${userData.profile.is_active ? 'text-blue-400' : 'text-red-400'}`}>Status: {userData.profile.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Subscriptions */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><RiShieldStarLine size={20} /></div>
                                <h3 className="text-lg font-bold text-slate-800">Subscriptions ({userData.subscriptions.length})</h3>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {userData.subscriptions.map(sub => {
                                    const isExpired = sub.current_period_end ? new Date(sub.current_period_end) < new Date() : false;
                                    return (
                                        <div key={sub.subscription_id} className="p-4 border border-slate-100 rounded-xl hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/manager/subscriptions/${sub.subscription_id}`)}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-slate-700">{sub.package_name || 'Custom Package'}</span>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isExpired ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                    {isExpired ? 'Expired' : sub.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 space-y-1">
                                                <p>ID: #{sub.subscription_id} • Workspace: {sub.tenant_name || 'None'}</p>
                                                {sub.current_period_end && <p>Expires: {new Date(sub.current_period_end).toLocaleDateString()}</p>}
                                            </div>
                                        </div>
                                    )
                                })}
                                {userData.subscriptions.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No subscriptions found.</p>}
                            </div>
                        </div>

                        {/* Purchases */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-purple-50 text-purple-500 rounded-xl"><RiMoneyDollarBoxLine size={20} /></div>
                                <h3 className="text-lg font-bold text-slate-800">Purchases ({userData.purchases.length})</h3>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {userData.purchases.map(p => (
                                    <div key={p.purchase_id} className="p-4 border border-slate-100 rounded-xl hover:border-purple-200 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/manager/purchases/${p.purchase_id}/page`)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-700">{p.package_name || 'Package'}</span>
                                            <span className="font-black text-purple-600">৳{p.final_amount}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 space-y-1">
                                            <p>TxID: {p.transaction_id || 'N/A'} • Status: <span className="uppercase font-semibold">{p.purchase_status}</span></p>
                                            <p>Date: {new Date(p.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {userData.purchases.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No purchases found.</p>}
                            </div>
                        </div>

                        {/* Tenants / Workspaces */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><RiServerLine size={20} /></div>
                                <h3 className="text-lg font-bold text-slate-800">Workspaces ({userData.tenants.length})</h3>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {userData.tenants.map(t => (
                                    <div key={t.tenant_id} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/manager/tenants/${t.tenant_id}`)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-700">{t.name}</span>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${t.status === 'active' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <p>{t.domain || 'No domain attached'}</p>
                                        </div>
                                    </div>
                                ))}
                                {userData.tenants.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No workspaces found.</p>}
                            </div>
                        </div>

                        {/* Support Tickets */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><RiInboxLine size={20} /></div>
                                <h3 className="text-lg font-bold text-slate-800">Support Tickets ({userData.tickets.length})</h3>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {userData.tickets.map(t => (
                                    <div key={t.ticket_id} className="p-4 border border-slate-100 rounded-xl hover:border-amber-200 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/support/tickets/${t.ticket_id}/page`)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-700 truncate mr-4">{t.subject}</span>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-500 uppercase tracking-wider shrink-0">
                                                {t.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <p>Created: {new Date(t.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {userData.tickets.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No tickets found.</p>}
                            </div>
                        </div>
                        
                    </div>
                </div>
            )}

        </div>
    )
}

export default DataHubPage
