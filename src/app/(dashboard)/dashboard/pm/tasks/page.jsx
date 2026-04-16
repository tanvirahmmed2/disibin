'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiAddLine, RiTaskLine } from 'react-icons/ri'

const PMTasks = () => {
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        type: 'group',
        assignedTo: '',
        priority: 'medium'
    })

    const fetchTasks = async () => {
        try {
            const [tRes, uRes] = await Promise.all([
                axios.get('/api/task'),
                axios.get('/api/user?role=staff')
            ])
            setTasks(tRes.data.payload)
            setUsers(uRes.data.payload)
        } catch (error) {
            console.error('Failed to fetch tasks', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/task', newTask)
            setShowModal(false)
            fetchTasks()
        } catch (error) {
            alert('Failed to create task')
        }
    }

    const columns = [
        { label: 'Project Task', key: 'title', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.title}</span>
                <span className="text-[10px] text-slate-400">{row.description}</span>
            </div>
        )},
        { label: 'Assigned Staff', key: 'assignedTo', render: (row) => (
            <span className="text-xs font-medium text-slate-600">{row.assignedTo?.name || 'Pending'}</span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {row.status}
            </span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Project Tasks</h1>
                    <p className="text-slate-500">Manage deliverables and assign them to staff members.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold"
                >
                    <RiAddLine /> New Assignment
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={tasks} loading={loading} />
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">New Task Assignment</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                                placeholder="Task title"
                                required
                                value={newTask.title}
                                onChange={e => setNewTask({...newTask, title: e.target.value})}
                            />
                            <textarea 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none h-24"
                                placeholder="Description"
                                value={newTask.description}
                                onChange={e => setNewTask({...newTask, description: e.target.value})}
                            />
                            <select 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                                required
                                value={newTask.assignedTo}
                                onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                            >
                                <option value="">Assign to Staff</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.name}</option>
                                ))}
                            </select>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold">Assign</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PMTasks
