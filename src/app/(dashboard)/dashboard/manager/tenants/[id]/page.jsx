'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { 
    RiArrowLeftLine, 
    RiServerLine, 
    RiUserLine, 
    RiGlobalLine, 
    RiShieldFlashLine,
    RiPauseCircleLine,
    RiPlayCircleLine,
    RiEdit2Line,
    RiCheckLine,
    RiCloseLine,
    RiAddLine,
    RiDeleteBinLine,
    RiSaveLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

/* ─── Inline editable field ─────────────────────────────────────────── */
const EditableField = ({ label, value, onSave, type = 'text' }) => {
    const [editing, setEditing] = useState(false)
    const [val, setVal] = useState(value || '')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await onSave(val)
        setSaving(false)
        setEditing(false)
    }

    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            {editing ? (
                <div className="flex items-center gap-2">
                    <input
                        type={type}
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        className="flex-1 border border-emerald-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
                    />
                    <button onClick={handleSave} disabled={saving} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiCheckLine size={16} />}
                    </button>
                    <button onClick={() => { setVal(value || ''); setEditing(false); }} className="p-1.5 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors">
                        <RiCloseLine size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 group">
                    <p className="text-base font-bold text-slate-800">{value || <span className="text-slate-300 font-normal italic">Not set</span>}</p>
                    <button onClick={() => { setVal(value || ''); setEditing(true); }} className="p-1 text-slate-300 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100">
                        <RiEdit2Line size={14} />
                    </button>
                </div>
            )}
        </div>
    )
}

/* ─── Website row with inline edit ──────────────────────────────────── */
const WebsiteRow = ({ site, onUpdate, onDelete }) => {
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ name: site.name || '', domain: site.domain || '', status: site.status })
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await onUpdate(site.website_id, form)
        setSaving(false)
        setEditing(false)
    }

    const statusColors = {
        active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        development: 'bg-blue-50 text-blue-600 border-blue-100',
        maintenance: 'bg-amber-50 text-amber-600 border-amber-100',
        suspended: 'bg-red-50 text-red-500 border-red-100',
    }

    if (editing) {
        return (
            <div className="p-4 bg-slate-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Website Name</label>
                        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-emerald-400"
                            placeholder="My Website" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Domain</label>
                        <input value={form.domain} onChange={e => setForm({...form, domain: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-emerald-400"
                            placeholder="example.com" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-emerald-400">
                            <option value="active">Active</option>
                            <option value="development">Development</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50">
                        <RiSaveLine size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditing(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-colors">
            <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">{site.name || 'Unnamed Site'}</p>
                <p className="text-xs text-slate-400 font-medium truncate">{site.domain || 'No domain'}</p>
            </div>
            <div className="flex items-center gap-3 ml-4">
                <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${statusColors[site.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {site.status}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(true)} className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                        <RiEdit2Line size={16} />
                    </button>
                    <button onClick={() => onDelete(site.website_id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <RiDeleteBinLine size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
const TenantDetails = () => {
    const params = useParams()
    const router = useRouter()
    const id = params.id
    
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [addingWebsite, setAddingWebsite] = useState(false)
    const [newSite, setNewSite] = useState({ name: '', domain: '', status: 'development' })

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/tenant/${id}`)
            setData(res.data.data)
        } catch {
            toast.error('Failed to load tenant details')
            router.push('/dashboard/manager/tenants')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { if (id) fetchData() }, [id])

    const handleTenantUpdate = async (field, value) => {
        try {
            const res = await axios.patch(`/api/tenant/${id}`, { [field]: value })
            if (res.data.success) {
                toast.success('Updated successfully')
                setData(prev => ({ ...prev, [field]: value }))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update')
            throw error
        }
    }

    const handleStatusChange = async (newStatus) => {
        if (!window.confirm(`${newStatus === 'suspended' ? 'Suspend' : 'Activate'} this tenant?`)) return
        setUpdating(true)
        try {
            await handleTenantUpdate('status', newStatus)
        } finally {
            setUpdating(false)
        }
    }

    const handleWebsiteUpdate = async (websiteId, form) => {
        try {
            const res = await axios.patch('/api/website', { id: websiteId, ...form })
            if (res.data.success) {
                toast.success('Website updated')
                setData(prev => ({
                    ...prev,
                    websites: prev.websites.map(w => w.website_id === websiteId ? res.data.data : w)
                }))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update website')
            throw error
        }
    }

    const handleWebsiteDelete = async (websiteId) => {
        if (!window.confirm('Delete this website?')) return
        try {
            await axios.delete('/api/website', { data: { id: websiteId } })
            toast.success('Website deleted')
            setData(prev => ({ ...prev, websites: prev.websites.filter(w => w.website_id !== websiteId) }))
        } catch (error) {
            toast.error('Failed to delete website')
        }
    }

    const handleAddWebsite = async () => {
        try {
            const res = await axios.post('/api/website', { tenant_id: id, ...newSite })
            if (res.data.success) {
                toast.success('Website added')
                setData(prev => ({ ...prev, websites: [...(prev.websites || []), res.data.data] }))
                setNewSite({ name: '', domain: '', status: 'development' })
                setAddingWebsite(false)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add website')
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    if (!data) return null

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard/manager/tenants')}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <RiArrowLeftLine size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{data.name}</h1>
                        <p className="text-slate-500 font-medium">Tenant ID: {data.tenant_id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border
                        ${data.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          data.status === 'suspended' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-red-50 text-red-500 border-red-100'}`}>
                        {data.status}
                    </span>
                    {data.status === 'active' ? (
                        <button onClick={() => handleStatusChange('suspended')} disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all disabled:opacity-50">
                            <RiPauseCircleLine size={16} /> Suspend
                        </button>
                    ) : (
                        <button onClick={() => handleStatusChange('active')} disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50">
                            <RiPlayCircleLine size={16} /> Activate
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Tenant Info — editable */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <RiServerLine size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Tenant Info</h2>
                    </div>
                    <div className="space-y-5">
                        <EditableField label="Name" value={data.name} onSave={v => handleTenantUpdate('name', v)} />
                        <EditableField label="Primary Domain" value={data.domain} onSave={v => handleTenantUpdate('domain', v)} />
                        <EditableField label="Subdomain" value={data.subdomain} onSave={v => handleTenantUpdate('subdomain', v)} />
                    </div>
                </div>

                {/* Owner Info */}
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-lg space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <RiUserLine size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Owner Details</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</p>
                            <p className="text-base font-bold">{data.owner_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                            <p className="text-sm font-medium text-slate-300">{data.owner_email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                            <p className="text-sm font-medium text-slate-300">{data.owner_phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                            <RiShieldFlashLine size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Subscription</h2>
                    </div>
                    <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</span>
                            <span className="text-sm font-bold text-slate-800">{data.package_name || 'No Plan'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                            <span className="text-sm font-bold text-emerald-600 uppercase">{data.subscription_status || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expires</span>
                            <span className="text-sm font-bold text-slate-700">
                                {data.is_lifetime ? 'Lifetime' : data.current_period_end ? new Date(data.current_period_end).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Websites — full CRUD */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <RiGlobalLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Websites</h2>
                        </div>
                        <button onClick={() => setAddingWebsite(true)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors">
                            <RiAddLine size={14} /> Add Site
                        </button>
                    </div>

                    <div className="space-y-3">
                        {data.websites?.map(site => (
                            <WebsiteRow
                                key={site.website_id}
                                site={site}
                                onUpdate={handleWebsiteUpdate}
                                onDelete={handleWebsiteDelete}
                            />
                        ))}

                        {(!data.websites || data.websites.length === 0) && !addingWebsite && (
                            <div className="text-center py-8">
                                <RiGlobalLine size={32} className="text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-400 font-medium">No websites configured.</p>
                            </div>
                        )}

                        {/* Add new website form */}
                        {addingWebsite && (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">New Website</p>
                                <div className="grid grid-cols-1 gap-3">
                                    <input value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})}
                                        placeholder="Website name" 
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-400 bg-white" />
                                    <input value={newSite.domain} onChange={e => setNewSite({...newSite, domain: e.target.value})}
                                        placeholder="domain.com" 
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-400 bg-white" />
                                    <select value={newSite.status} onChange={e => setNewSite({...newSite, status: e.target.value})}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-400 bg-white">
                                        <option value="development">Development</option>
                                        <option value="active">Active</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleAddWebsite}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors">
                                        <RiCheckLine size={14} /> Add Website
                                    </button>
                                    <button onClick={() => setAddingWebsite(false)}
                                        className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TenantDetails
