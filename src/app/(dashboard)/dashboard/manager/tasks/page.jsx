'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { 
    RiAddLine, 
    RiTaskLine, 
    RiUserAddLine, 
    RiTimeLine, 
    RiFlag2Line,
    RiChat3Line,
    RiDeleteBinLine,
    RiSendPlaneFill,
    RiCloseLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const ManagerTasks = () => {
    const { userData } = useContext(Context)
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    
    // UI State
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [chatMessages, setChatMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    
    // Forms
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: ''
    })

    const messagesEndRef = useRef(null)

    const fetchData = async () => {
        try {
            const [taskRes, userRes] = await Promise.all([
                axios.get('/api/task'),
                axios.get('/api/user') 
            ])
            if(taskRes.data.success) setTasks(taskRes.data.data)
            if(userRes.data.success) setUsers(userRes.data.data.filter(u => ['developer', 'support', 'manager'].includes(u.role)))
        } catch (error) {
            console.error('Failed to fetch data', error)
            toast.error('Failed to load tasks')
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
            const res = await axios.post('/api/task', newTask)
            if(res.data.success) {
                toast.success('Task created successfully')
                setShowCreateModal(false)
                setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' })
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create task')
        }
    }

    const handleDeleteTask = async (id) => {
        if(!confirm('Are you sure you want to delete this task? All chat history will be lost.')) return
        try {
            const res = await axios.delete('/api/task', { data: { id } })
            if(res.data.success) {
                toast.success('Task deleted')
                fetchData()
            }
        } catch (error) {
            toast.error('Failed to delete task')
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch('/api/task', { id, status: newStatus })
            toast.success('Status updated')
            fetchData()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const openTaskChat = async (task) => {
        setSelectedTask(task)
        try {
            const res = await axios.get(`/api/task/${task.task_id}/chat`)
            if(res.data.success) {
                setChatMessages(res.data.data)
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                }, 100)
            }
        } catch (error) {
            toast.error('Failed to load chat')
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if(!newMessage.trim()) return
        try {
            const res = await axios.post(`/api/task/${selectedTask.task_id}/chat`, { message: newMessage })
            if(res.data.success) {
                setChatMessages([...chatMessages, res.data.data])
                setNewMessage('')
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                }, 100)
            }
        } catch (error) {
            toast.error('Failed to send message')
        }
    }

    const columns = [
        { label: 'Task', key: 'title', render: (row) => (
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => openTaskChat(row)}>
                <div className={`p-2 rounded-lg transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600 ${row.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                    <RiTaskLine size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{row.title}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{row.description}</span>
                </div>
            </div>
        )},
        { label: 'Assigned To', key: 'assigned_to_name', render: (row) => (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                    {row.assigned_to_name?.charAt(0) || '?'}
                </div>
                <span className="text-xs font-medium text-slate-600">{row.assigned_to_name || 'Unassigned'}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.priority === 'urgent' ? 'bg-red-100 text-red-700' : 
                  row.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                  'bg-slate-100 text-slate-700'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <select 
                value={row.status}
                onChange={(e) => handleStatusChange(row.task_id, e.target.value)}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border-none focus:ring-0 cursor-pointer
                    ${row.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      row.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'}`}
            >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
            </select>
        )},
        { label: 'Actions', key: 'actions', render: (row) => (
            <div className="flex items-center gap-2">
                <button onClick={() => openTaskChat(row)} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Chat & Details">
                    <RiChat3Line size={18} />
                </button>
                <button onClick={() => handleDeleteTask(row.task_id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Task">
                    <RiDeleteBinLine size={18} />
                </button>
            </div>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Management</h1>
                    <p className="text-slate-500 font-medium">Assign tasks and collaborate with developers.</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm transition-all hover:bg-emerald-500 shadow-md shadow-slate-900/10 active:scale-95"
                >
                    <RiAddLine size={20} /> Create Task
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2">
                <DataTable columns={columns} data={tasks} loading={loading} />
            </div>

            {/* Create Task Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Task Title</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500"
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                    placeholder="Implement new API route..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Description</label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 resize-none h-24"
                                    value={newTask.description}
                                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    placeholder="Detailed instructions..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Assign To</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500"
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
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Priority</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500"
                                        value={newTask.priority}
                                        onChange={e => setNewTask({...newTask, priority: e.target.value})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md">
                                    Publish Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Detail & Chat Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 lg:p-10">
                    <div className="bg-white w-full max-w-4xl h-full max-h-[800px] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                        
                        {/* Task Details Sidebar */}
                        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-100 p-6 flex flex-col overflow-y-auto">
                            <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm md:hidden">
                                <RiCloseLine size={24} />
                            </button>

                            <div className="mb-6 mt-6 md:mt-0">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedTask.title}</h2>
                                <p className="text-sm text-slate-600">{selectedTask.description || 'No description provided.'}</p>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="bg-white p-4 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-bold text-slate-900 capitalize">{selectedTask.status.replace('_', ' ')}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                                    <p className="text-sm font-bold text-slate-900 capitalize">{selectedTask.priority}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned To</p>
                                    <p className="text-sm font-bold text-emerald-600">{selectedTask.assigned_to_name}</p>
                                </div>
                            </div>

                            <div className="mt-6 hidden md:block">
                                <button onClick={() => setSelectedTask(null)} className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                                    Close Panel
                                </button>
                            </div>
                        </div>

                        {/* Task Chat Area */}
                        <div className="w-full md:w-2/3 flex flex-col bg-white h-[50vh] md:h-auto">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <RiChat3Line className="text-emerald-500" size={20} /> Task Discussion
                                </h3>
                                <button onClick={() => setSelectedTask(null)} className="p-2 text-slate-400 hover:text-slate-900 hidden md:block">
                                    <RiCloseLine size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                                {chatMessages.length === 0 ? (
                                    <div className="text-center py-10">
                                        <RiChat3Line size={40} className="mx-auto text-slate-200 mb-2" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                                        <p className="text-xs text-slate-400">Start the conversation below.</p>
                                    </div>
                                ) : (
                                    chatMessages.map(msg => {
                                        const isMe = msg.user_id === userData.id
                                        return (
                                            <div key={msg.message_id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 px-1">
                                                    {msg.sender_name} <span className="opacity-50 mx-1">•</span> {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${isMe ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                                                    {msg.message}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:hover:bg-emerald-500 shadow-md"
                                    >
                                        <RiSendPlaneFill size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default ManagerTasks
