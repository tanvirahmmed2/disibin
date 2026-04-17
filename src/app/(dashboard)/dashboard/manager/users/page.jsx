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
            setUsers(res.data.payload)
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
                <span className="font-bold text-slate-700">{row.name}</span>
                <span className="text-xs text-slate-400">{row.email}</span>
            </div>
        )},
        { label: 'Role', key: 'role', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.role === 'client' ? 'bg-slate-100 text-slate-500' : 'bg-primary/10 text-primary'}`}>
                {row.role}
            </span>
        )},
        { label: 'Status', key: 'isActive', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {row.isActive ? 'Active' : 'Inactive'}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => toggleStatus(row._id, row.isActive)}
                className={`p-2 rounded-lg transition-all ${row.isActive ? 'hover:bg-amber-50 text-amber-500' : 'hover:bg-emerald-50 text-emerald-600'}`}
                title={row.isActive ? 'Suspend Access' : 'Restore Access'}
            >
                <RiToggleLine size={18} />
            </button>
            <button 
                disabled={row.role === 'admin'}
                onClick={() => handleDelete(row._id)}
                className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-all disabled:opacity-20"
                title="Delete User"
            >
                <RiDeleteBinLine size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Oversight</h1>
                <p className="text-slate-500 font-medium">Manage platform accounts and session privileges.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={users} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerUsers
