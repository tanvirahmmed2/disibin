'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import {
    RiUserSharedLine,
    RiToggleLine,
    RiCloseLine,
    RiCheckLine,
    RiSearchLine,
    RiUserLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const ROLE_STYLES = {
    admin:     'text-red-600 bg-red-50 border-red-200',
    manager:   'text-blue-600 bg-blue-50 border-blue-200',
    developer: 'text-purple-600 bg-purple-50 border-purple-200',
    support:   'text-amber-600 bg-amber-50 border-amber-200',
    user:      'text-slate-500 bg-slate-50 border-slate-200',
}

const ROLES = ['admin', 'manager', 'support', 'developer', 'user']

const UserManager = () => {
    const [users, setUsers]           = useState([])
    const [loading, setLoading]       = useState(true)
    const [promotingUser, setPromotingUser] = useState(null)
    const [search, setSearch]         = useState('')
    const [roleFilter, setRoleFilter] = useState('')

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/user')
            if (res.data.success) setUsers(res.data.data)
        } catch {
            toast.error('Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (id, current) => {
        try {
            await axios.patch('/api/user', { id, isActive: !current })
            toast.success(current ? 'User deactivated' : 'User activated')
            fetchUsers()
        } catch {
            toast.error('Operation failed')
        }
    }

    const handlePromote = async (role) => {
        try {
            await axios.patch('/api/user/promote', { user_id: promotingUser.user_id, role })
            toast.success(`${promotingUser.name} is now ${role}`)
            setPromotingUser(null)
            fetchUsers()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Promotion failed')
        }
    }

    useEffect(() => { fetchUsers() }, [])

    const filtered = users.filter(u => {
        const matchSearch = !search ||
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        const matchRole = !roleFilter || u.role === roleFilter
        return matchSearch && matchRole
    })

    const counts = ROLES.reduce((acc, r) => {
        acc[r] = users.filter(u => u.role === r).length
        return acc
    }, {})

    const columns = [
        {
            label: 'User', key: 'name', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 border border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase shrink-0">
                        {row.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 text-[10px] uppercase tracking-tight truncate">{row.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{row.email}</span>
                    </div>
                </div>
            )
        },
        {
            label: 'Role', key: 'role', render: (row) => (
                <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${ROLE_STYLES[row.role] || ROLE_STYLES.user}`}>
                    {row.role}
                </span>
            )
        },
        {
            label: 'Status', key: 'is_active', render: (row) => (
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${row.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {row.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            )
        },
        {
            label: 'Joined', key: 'created_at', render: (row) => (
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </span>
            )
        },
    ]

    const actions = (row) => (
        <div className="flex items-center gap-1">
            <button
                onClick={() => setPromotingUser(row)}
                className="px-2 py-1 border border-slate-200 text-slate-400 hover:border-slate-800 hover:text-slate-800 transition-all text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"
                title="Change Role"
            >
                <RiUserSharedLine size={12} /> Role
            </button>
            <button
                onClick={() => toggleStatus(row.user_id, row.is_active)}
                className={`px-2 py-1 border text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${
                    row.is_active
                        ? 'border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                }`}
                title={row.is_active ? 'Deactivate' : 'Activate'}
            >
                <RiToggleLine size={12} /> {row.is_active ? 'Disable' : 'Enable'}
            </button>
        </div>
    )

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="border-b border-slate-200 pb-4 flex items-end justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">System Users</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {users.length} total users — adjust roles and account status.
                    </p>
                </div>
            </div>

            {/* Role Counts */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setRoleFilter('')}
                    className={`px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest transition-all ${!roleFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-500'}`}
                >
                    All · {users.length}
                </button>
                {ROLES.map(r => (
                    <button
                        key={r}
                        onClick={() => setRoleFilter(r === roleFilter ? '' : r)}
                        className={`px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-slate-900 text-white border-slate-900' : `${ROLE_STYLES[r]} hover:opacity-80`}`}
                    >
                        {r} · {counts[r] || 0}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 w-full max-w-sm">
                <RiSearchLine size={13} className="text-slate-300 shrink-0" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="flex-1 bg-transparent text-[10px] font-bold text-slate-700 placeholder-slate-300 focus:outline-none"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="text-slate-300 hover:text-slate-700 transition-all">
                        <RiCloseLine size={13} />
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={filtered} loading={loading} actions={actions} />
            </div>

            {/* Role Change Modal */}
            {promotingUser && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Adjust Role</p>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">{promotingUser.name}</h3>
                            </div>
                            <button onClick={() => setPromotingUser(null)} className="text-slate-400 hover:text-slate-900 transition-all">
                                <RiCloseLine size={18} />
                            </button>
                        </div>

                        <div className="p-4 space-y-2">
                            {ROLES.map(r => (
                                <button
                                    key={r}
                                    onClick={() => handlePromote(r)}
                                    className={`w-full flex items-center justify-between px-4 py-3 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        promotingUser.role === r
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : `${ROLE_STYLES[r]} hover:opacity-80`
                                    }`}
                                >
                                    <span>{r}</span>
                                    {promotingUser.role === r && <RiCheckLine size={14} />}
                                </button>
                            ))}
                        </div>

                        <div className="px-4 pb-4">
                            <button
                                onClick={() => setPromotingUser(null)}
                                className="w-full py-2.5 border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManager
