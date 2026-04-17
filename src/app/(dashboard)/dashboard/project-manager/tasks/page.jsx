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
            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest
                ${row.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-primary/5 text-primary'}`}>
                {row.status}
            </span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Tasks</h1>
                    <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden">Manage deliverables and assign them to staff members.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95"
                >
                    <RiAddLine size={20} /> New Assignment
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={tasks} loading={loading} />
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">New Task Assignment</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Task Title</label>
                                <input 
                                    className="input-standard"
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job description</label>
                                <textarea 
                                    className="input-standard h-24 pt-3"
                                    value={newTask.description}
                                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select executor</label>
                                <select 
                                    className="input-standard cursor-pointer"
                                    required
                                    value={newTask.assignedTo}
                                    onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                                >
                                    <option value="">Assign to Staff</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-6 border-t border-slate-50">
                                <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">Assign</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-all">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PMTasks
