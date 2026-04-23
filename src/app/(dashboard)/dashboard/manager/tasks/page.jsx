'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { 
    RiAddLine, 
    RiTaskLine, 
    RiUserAddLine, 
    RiTimeLine, 
    RiFlag2Line,
    RiChat3Line
} from 'react-icons/ri'

const ManagerTasks = () => {
    const { userData } = useContext(Context)
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        type: 'direct',
        assignedTo: '',
        priority: 'medium',
        deadline: ''
    })

    const fetchData = async () => {
        try {
            const [taskRes, userRes] = await Promise.all([
                axios.get('/api/task'),
                axios.get('/api/user') 
            ])
            setTasks(taskRes.data.data)
            
            setUsers(userRes.data.data.filter(u => ['developer', 'support', 'manager'].includes(u.role)))
        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreateTask = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/task', newTask)
            setShowModal(false)
            setNewTask({ title: '', description: '', type: 'direct', assignedTo: '', priority: 'medium', deadline: '' })
            fetchData()
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create task')
        }
    }

    const columns = [
        { label: 'Task', key: 'title', render: (row) => (
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${row.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                    <RiTaskLine />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{row.title}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{row.description}</span>
                </div>
            </div>
        )},
        { label: 'Assigned To', key: 'assigned_to_name', render: (row) => (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                    {row.assigned_to_name?.charAt(0) || '?'}
                </div>
                <span className="text-xs font-medium text-slate-600">{row.assigned_to_name || 'Unassigned'}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.priority === 'urgent' ? 'bg-red-100 text-red-700' : 
                  row.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                  'bg-primary/10 text-primary-dark'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.status === 'in_progress' ? 'bg-primary text-primary' : 'bg-slate-100 text-slate-700'}`}>
                {row.status.replace('_', ' ')}
            </span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Management</h1>
                    <p className="text-slate-500 font-medium">Assign and track operational tasks across teams.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:bg-primary shadow-xl shadow-slate-900/10 active:scale-95"
                >
                    <RiAddLine size={20} /> Create Task
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={tasks} loading={loading} />
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Create New Task</h2>
                        <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Task Title</label>
                                <input 
                                    className="input-standard"
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Description</label>
                                <textarea 
                                    className="input-standard h-24 pt-3"
                                    value={newTask.description}
                                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Assign To</label>
                                <select 
                                    className="input-standard cursor-pointer"
                                    required
                                    value={newTask.assignedTo}
                                    onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                                >
                                    <option value="">Select User</option>
                                    {users.map(u => (
                                        <option key={u.user_id} value={u.user_id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest px-1">Priority Level</label>
                                <select 
                                    className="input-standard cursor-pointer"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-4 mt-4">
                                <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all">
                                    Publish Task
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[11px]"
                                >
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManagerTasks
