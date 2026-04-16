'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiUserSharedLine, RiShieldUserLine, RiToggleLine } from 'react-icons/ri'

const UserManager = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [promotingUser, setPromotingUser] = useState(null)

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

    const handlePromote = async (id, role) => {
        try {
            await axios.patch('/api/user/promote', { user_id: id, role })
            setPromotingUser(null)
            fetchUsers()
        } catch (error) {
            alert(error.response?.data?.message || 'Promotion failed')
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
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                ${row.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                  row.role === 'manager' ? 'bg-blue-100 text-blue-700' : 
                  'bg-slate-100 text-slate-500'}`}>
                {row.role}
            </span>
        )},
        { label: 'Status', key: 'isActive', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {row.isActive ? 'Active' : 'Inactive'}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => setPromotingUser(row)}
                className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all font-bold text-xs flex items-center gap-1"
                title="Change Role"
            >
                <RiUserSharedLine size={18} /> Role
            </button>
            <button 
                onClick={() => toggleStatus(row._id, row.isActive)}
                className={`p-2 rounded-lg transition-all ${row.isActive ? 'hover:bg-rose-50 text-rose-500' : 'hover:bg-emerald-50 text-emerald-600'}`}
                title={row.isActive ? 'Deactivate' : 'Activate'}
            >
                <RiToggleLine size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Users</h1>
                    <p className="text-slate-500">Manage all registered users, adjust roles, and control account status.</p>
                </div>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={users} loading={loading} actions={actions} />
            </div>

            {}
            {promotingUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Adjust Role</h2>
                        <p className="text-slate-500 mb-6 text-sm italic">Assigning new role to {promotingUser.name}</p>
                        
                        <div className="grid grid-cols-1 gap-2">
                            {["admin", "manager", "project_manager", "editor", "support", "staff", "client"].map(role => (
                                <button
                                    key={role}
                                    onClick={() => handlePromote(promotingUser._id, role)}
                                    className={`w-full py-3 rounded-xl text-sm font-bold capitalize transition-all
                                    ${promotingUser.role === role ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                >
                                    {role.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => setPromotingUser(null)}
                            className="w-full mt-6 py-3 text-slate-400 font-bold hover:text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default UserManager
