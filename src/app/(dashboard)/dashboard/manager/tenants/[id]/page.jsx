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
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            {editing ? (
                <div className="flex items-center gap-1">
                    <input
                        type={type}
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        className="flex-1 border border-slate-300 px-3 py-1 text-xs font-bold focus:outline-none focus:border-slate-400"
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
                    />
                    <button onClick={handleSave} disabled={saving} className="p-1 border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50">
                        {saving ? <div className="w-3 h-3 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin" /> : <RiCheckLine size={14} />}
                    </button>
                    <button onClick={() => { setVal(value || ''); setEditing(false); }} className="p-1 border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
                        <RiCloseLine size={14} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 group">
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{value || <span className="text-slate-300 font-normal italic">Not set</span>}</p>
                    <button onClick={() => { setVal(value || ''); setEditing(true); }} className="p-1 border border-slate-100 text-slate-300 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                        <RiEdit2Line size={12} />
                    </button>
                </div>
            )}
        </div>
    )
}

/* ─── Website row — Editable Status ───────────────────────────────── */
const WebsiteRow = ({ site, onStatusUpdate }) => {
    const [expanded, setExpanded] = useState(false)
    const [updating, setUpdating] = useState(false)
    
    const statusColors = {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        development: 'bg-blue-50 text-blue-700 border-blue-100',
        maintenance: 'bg-amber-50 text-amber-700 border-amber-100',
        suspended: 'bg-red-50 text-red-700 border-red-100',
    }

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true)
        try {
            await onStatusUpdate(newStatus)
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="bg-white border border-slate-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-white border-b border-slate-100">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {site.logo ? <img src={site.logo} className="w-full h-full object-contain" alt="Logo" /> : <RiGlobalLine className="text-slate-200" size={18} />}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate text-sm uppercase tracking-tight">{site.name || 'Unnamed Site'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{site.domain || 'No domain'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={site.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updating}
                        className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest focus:outline-none transition-all
                            ${statusColors[site.status] || 'bg-slate-50 text-slate-500 border-slate-100'}`}
                    >
                        <option value="active">Active</option>
                        <option value="development">Dev</option>
                        <option value="maintenance">Maint</option>
                        <option value="suspended">Susp</option>
                    </select>
                    <button 
                        onClick={() => setExpanded(!expanded)}
                        className="p-1.5 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all"
                    >
                        {expanded ? <RiArrowUpSLine size={14} /> : <RiArrowDownSLine size={14} />}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="p-6 space-y-6 bg-slate-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Business Info</h4>
                                <div className="space-y-2">
                                    <DetailItem label="Official Name" value={site.business_name} />
                                    <DetailItem label="Email" value={site.email} />
                                    <DetailItem label="Phone" value={site.phone} />
                                    <DetailItem label="Address" value={`${site.address || ''}, ${site.city || ''}, ${site.country || ''}`} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Social</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <DetailItem label="Facebook" value={site.facebook} isLink />
                                    <DetailItem label="Instagram" value={site.instagram} isLink />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">SEO</h4>
                                <div className="space-y-3 bg-white p-4 border border-slate-200">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meta Title</p>
                                        <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{site.meta_title || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter leading-relaxed">{site.meta_description || 'No description provided.'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`p-3 border ${site.is_public ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200 opacity-50'}`}>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visibility</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase">{site.is_public ? 'Public' : 'Hidden'}</p>
                                </div>
                                <div className={`p-3 border ${site.is_store_enabled ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-200 opacity-50'}`}>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Store</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase">{site.is_store_enabled ? 'Enabled' : 'Disabled'}</p>
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
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        {isLink && value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-tight flex items-center gap-1">
                Link <RiExternalLinkLine size={10} />
            </a>
        ) : (
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight truncate">{value || 'N/A'}</p>
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
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
    )

    if (!data) return null

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard/manager/tenants')}
                        className="p-2 border border-slate-200 hover:text-slate-900 transition-all">
                        <RiArrowLeftLine size={16} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{data.name}</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {data.tenant_id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border
                        ${data.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          data.status === 'suspended' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                          'bg-red-50 text-red-700 border-red-100'}`}>
                        {data.status}
                    </span>
                    {data.status === 'active' ? (
                        <button onClick={() => handleStatusChange('suspended')} disabled={updating}
                            className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50">
                            Suspend
                        </button>
                    ) : (
                        <button onClick={() => handleStatusChange('active')} disabled={updating}
                            className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50">
                            Activate
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Tenant Info */}
                <div className="bg-white p-6 border border-slate-200 space-y-4">
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Tenant Details</h2>
                    <div className="space-y-4">
                        <EditableField label="Name" value={data.name} onSave={v => handleTenantUpdate('name', v)} />
                        <EditableField label="Primary Domain" value={data.domain} onSave={v => handleTenantUpdate('domain', v)} />
                        <EditableField label="Subdomain" value={data.subdomain} onSave={v => handleTenantUpdate('subdomain', v)} />
                    </div>
                </div>

                {/* Owner Info */}
                <div className="bg-white p-6 border border-slate-200 space-y-4">
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Owner Details</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</p>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{data.owner_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{data.owner_email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{data.owner_phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-white p-6 border border-slate-200 space-y-4">
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Subscription</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Plan</span>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{data.package_name || 'No Plan'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">{data.subscription_status || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expires</span>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                                {data.is_lifetime ? 'Lifetime' : data.current_period_end ? new Date(data.current_period_end).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Linked Website */}
                <div className="bg-white p-6 border border-slate-200 space-y-4">
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Websites</h2>
                    <div className="space-y-2">
                        {data.websites?.map(site => (
                            <WebsiteRow
                                key={site.website_id}
                                site={site}
                                onStatusUpdate={(s) => handleTenantUpdate('websiteStatus', s)}
                            />
                        ))}

                        {(!data.websites || data.websites.length === 0) && (
                            <div className="text-center py-4 border border-dashed border-slate-200">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No websites configured.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TenantDetails
