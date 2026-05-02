'use client'
import React, { useState } from 'react'
import axios from 'axios'
import {
    RiShieldUserLine,
    RiSendPlaneFill,
    RiCheckLine,
    RiErrorWarningLine,
    RiAdminLine,
    RiTeamLine,
    RiCustomerService2Line,
    RiCodeSSlashLine,
    RiUserLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const ROLE_DEFINITIONS = [
    {
        role:        'admin',
        label:       'Administrator',
        icon:        RiAdminLine,
        color:       'text-red-600',
        bg:          'bg-red-50',
        border:      'border-red-200',
        description: 'Root access. Full control over users, finances, system config, and all platform operations.',
        perms:       ['User management', 'Financial reports', 'System config', 'Role promotion'],
    },
    {
        role:        'manager',
        label:       'Manager',
        icon:        RiTeamLine,
        color:       'text-blue-600',
        bg:          'bg-blue-50',
        border:      'border-blue-200',
        description: 'Team lead. Manages clients, projects, tasks, packages, and tickets.',
        perms:       ['Client oversight', 'Task assignment', 'Package management', 'Ticket handling'],
    },
    {
        role:        'support',
        label:       'Support Agent',
        icon:        RiCustomerService2Line,
        color:       'text-amber-600',
        bg:          'bg-amber-50',
        border:      'border-amber-200',
        description: 'Handles incoming tickets and client communications.',
        perms:       ['Ticket management', 'Client chat', 'Status updates'],
    },
    {
        role:        'developer',
        label:       'Developer',
        icon:        RiCodeSSlashLine,
        color:       'text-purple-600',
        bg:          'bg-purple-50',
        border:      'border-purple-200',
        description: 'Receives assigned tasks and collaborates with managers via task chat.',
        perms:       ['View assigned tasks', 'Update task status', 'Task discussion'],
    },
    {
        role:        'user',
        label:       'Standard User',
        icon:        RiUserLine,
        color:       'text-slate-500',
        bg:          'bg-slate-50',
        border:      'border-slate-200',
        description: 'Regular platform subscriber. Can purchase packages, create tickets, and leave reviews.',
        perms:       ['Purchase packages', 'Create tickets', 'Leave reviews'],
    },
]

const AdminRoles = () => {
    const [email, setEmail]     = useState('')
    const [role, setRole]       = useState('manager')
    const [loading, setLoading] = useState(false)
    const [result, setResult]   = useState(null)  // { type: 'success'|'error', text }

    const handlePromote = async (e) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)
        try {
            const res = await axios.patch('/api/user/promote', { email, role })
            if (res.data.success) {
                setResult({ type: 'success', text: res.data.message })
                toast.success(res.data.message)
                setEmail('')
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update role'
            setResult({ type: 'error', text: msg })
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const selectedDef = ROLE_DEFINITIONS.find(r => r.role === role)

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Role Management</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Promote users by email and adjust system permissions.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── Promote Form ── */}
                <div className="space-y-4">
                    <div className="bg-white border border-slate-200 p-6 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                                <RiShieldUserLine size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Promote User</p>
                                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">Assign a new system role</p>
                            </div>
                        </div>

                        <form onSubmit={handlePromote} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">User Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Assign Role *</label>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {ROLE_DEFINITIONS.map(def => (
                                        <button
                                            key={def.role}
                                            type="button"
                                            onClick={() => setRole(def.role)}
                                            className={`flex items-center gap-3 px-4 py-2.5 border text-left transition-all ${
                                                role === def.role
                                                    ? 'bg-slate-900 border-slate-900 text-white'
                                                    : `${def.bg} ${def.border} ${def.color} hover:opacity-80`
                                            }`}
                                        >
                                            <def.icon size={14} className="shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-widest">{def.label}</p>
                                            </div>
                                            {role === def.role && <RiCheckLine size={14} className="shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Result message */}
                            {result && (
                                <div className={`flex items-start gap-2 px-4 py-3 border text-[9px] font-bold uppercase tracking-widest ${
                                    result.type === 'success'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                    <RiErrorWarningLine size={14} className="shrink-0 mt-0.5" />
                                    {result.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full py-3 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <><RiSendPlaneFill size={13} /> Update Access</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Selected role preview */}
                    {selectedDef && (
                        <div className={`border p-4 ${selectedDef.bg} ${selectedDef.border}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <selectedDef.icon size={14} className={selectedDef.color} />
                                <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedDef.color}`}>
                                    {selectedDef.label} — Preview
                                </p>
                            </div>
                            <p className={`text-[9px] font-bold uppercase tracking-tight leading-relaxed mb-3 ${selectedDef.color} opacity-80`}>
                                {selectedDef.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {selectedDef.perms.map(p => (
                                    <span key={p} className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-widest bg-white ${selectedDef.border} ${selectedDef.color}`}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Role Hierarchy ── */}
                <div className="space-y-3">
                    <div className="border-b border-slate-200 pb-2 mb-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Role Hierarchy</p>
                    </div>
                    {ROLE_DEFINITIONS.map((def, i) => (
                        <div key={def.role} className={`border p-4 ${def.bg} ${def.border}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-7 h-7 border flex items-center justify-center shrink-0 bg-white ${def.border} ${def.color}`}>
                                    <def.icon size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className={`text-[10px] font-bold uppercase tracking-tight ${def.color}`}>{def.label}</p>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 border bg-white ${def.border} ${def.color}`}>
                                            Level {ROLE_DEFINITIONS.length - i}
                                        </span>
                                    </div>
                                    <p className={`text-[9px] font-bold uppercase tracking-tight leading-relaxed opacity-80 ${def.color} mb-2`}>
                                        {def.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {def.perms.map(p => (
                                            <span key={p} className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-white border ${def.border} ${def.color}`}>
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Security Notice */}
                    <div className="bg-slate-900 border border-slate-800 p-4">
                        <div className="flex items-start gap-3">
                            <RiErrorWarningLine size={14} className="text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1">Security Protocol</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                                    Promoting to Administrator grants full system control. The platform prevents removal of the last administrator to ensure operational continuity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminRoles
