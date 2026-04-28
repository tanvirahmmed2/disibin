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
    RiSaveLine,
    RiArrowUpSLine,
    RiArrowDownSLine,
    RiExternalLinkLine
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

/* ─── Website row — Read Only Full View ───────────────────────────────── */
const WebsiteRow = ({ site }) => {
    const [expanded, setExpanded] = useState(false)
    const statusColors = {
        active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        development: 'bg-blue-50 text-blue-600 border-blue-100',
        maintenance: 'bg-amber-50 text-amber-600 border-amber-100',
        suspended: 'bg-red-50 text-red-500 border-red-100',
    }

    return (
        <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-white border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                        {site.logo ? <img src={site.logo} className="w-full h-full object-contain" alt="Logo" /> : <RiGlobalLine className="text-slate-200" size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate text-lg">{site.name || 'Unnamed Site'}</p>
                        <p className="text-xs text-slate-400 font-medium truncate">{site.domain || 'No domain'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${statusColors[site.status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {site.status}
                    </span>
                    <button 
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                    >
                        {expanded ? <RiArrowUpSLine size={20} /> : <RiArrowDownSLine size={20} />}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="p-8 space-y-8 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Business & Appearance */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Business & Appearance</h4>
                                <div className="space-y-3">
                                    <DetailItem label="Official Name" value={site.business_name} />
                                    <DetailItem label="Email" value={site.email} />
                                    <DetailItem label="Phone" value={site.phone} />
                                    <DetailItem label="Address" value={`${site.address || ''}, ${site.city || ''}, ${site.country || ''}`} />
                                    <div className="flex gap-4 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: site.primary_color }}></div>
                                            <span className="text-[10px] font-bold text-slate-500">Primary</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: site.secondary_color }}></div>
                                            <span className="text-[10px] font-bold text-slate-500">Secondary</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Social Presence</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <DetailItem label="Facebook" value={site.facebook} isLink />
                                    <DetailItem label="Instagram" value={site.instagram} isLink />
                                    <DetailItem label="LinkedIn" value={site.linkedin} isLink />
                                    <DetailItem label="YouTube" value={site.youtube} isLink />
                                </div>
                            </div>
                        </div>

                        {/* SEO & Settings */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">SEO Metadata</h4>
                                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meta Title</p>
                                        <p className="text-sm font-bold text-slate-800">{site.meta_title || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meta Description</p>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{site.meta_description || 'No description provided.'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl border ${site.is_public ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-100 border-slate-200 opacity-50'}`}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visibility</p>
                                    <p className="text-xs font-bold text-slate-700">{site.is_public ? 'Public' : 'Hidden'}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border ${site.is_store_enabled ? 'bg-purple-50 border-purple-100' : 'bg-slate-100 border-slate-200 opacity-50'}`}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Store</p>
                                    <p className="text-xs font-bold text-slate-700">{site.is_store_enabled ? 'Enabled' : 'Disabled'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const DetailItem = ({ label, value, isLink }) => (
    <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        {isLink && value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                View Profile <RiExternalLinkLine size={12} />
            </a>
        ) : (
            <p className="text-sm font-bold text-slate-700 truncate">{value || 'N/A'}</p>
        )}
    </div>
)

/* ─── Main Page ──────────────────────────────────────────────────────── */
const TenantDetails = () => {
    const params = useParams()
    const router = useRouter()
    const id = params.id
    
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

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
                // Refresh data to show synced changes if any
                fetchData()
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

                {/* Websites — Read Only for Managers */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <RiGlobalLine size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Linked Website</h2>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {data.websites?.map(site => (
                            <WebsiteRow
                                key={site.website_id}
                                site={site}
                            />
                        ))}

                        {(!data.websites || data.websites.length === 0) && (
                            <div className="text-center py-8">
                                <RiGlobalLine size={32} className="text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-400 font-medium">No websites configured.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TenantDetails
