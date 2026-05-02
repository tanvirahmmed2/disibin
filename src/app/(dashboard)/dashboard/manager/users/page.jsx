'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiUserSharedLine, RiToggleLine, RiDeleteBinLine } from 'react-icons/ri'

const ManagerUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/user')
            setUsers(res.data.data)
        } catch (error) {
            console.error('Failed to fetch users', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (id, currentStatus) => {
        try {
            await axios.patch('/api/user', { id, isActive: !currentStatus })
            fetchUsers()
        } catch (error) {
            alert('Operation failed')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this user? This action is irreversible.')) return
        try {
            await axios.delete(`/api/user?id=${id}`)
            fetchUsers()
        } catch (error) {
            alert('Failed to delete user')
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const columns = [
        { label: 'Name', key: 'name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 uppercase tracking-tight text-xs">{row.name}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{row.email}</span>
            </div>
        )},
        { label: 'Role', key: 'role', render: (row) => (
            <span className="px-2 py-0.5 border border-slate-100 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                {row.role}
            </span>
        )},
        { label: 'Status', key: 'is_active', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                {row.is_active ? 'Active' : 'Inactive'}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1">
            <button 
                onClick={() => toggleStatus(row.user_id, row.is_active)}
                className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
                title={row.is_active ? 'Suspend' : 'Restore'}
            >
                <RiToggleLine size={16} />
            </button>
            <button 
                disabled={row.role === 'admin'}
                onClick={() => handleDelete(row.user_id)}
                className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-all disabled:opacity-20"
                title="Delete"
            >
                <RiDeleteBinLine size={16} />
            </button>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Users</h1>
                <p className="text-xs text-slate-500">Manage platform accounts and session privileges.</p>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={users} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerUsers
