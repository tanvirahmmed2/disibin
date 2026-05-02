'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import {
    RiAddLine,
    RiTaskLine,
    RiChat3Line,
    RiDeleteBinLine,
    RiSendPlaneFill,
    RiCloseLine,
    RiCalendarLine,
    RiUserLine,
    RiFlag2Line,
    RiMore2Line,
    RiCheckboxCircleLine,
    RiTimerLine,
    RiEyeLine,
    RiInboxLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: 'pending',     label: 'Pending',     color: 'text-slate-500',   bg: 'bg-slate-100',   border: 'border-slate-200' },
    { key: 'in_progress', label: 'In Progress', color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200' },
    { key: 'in_review',   label: 'In Review',   color: 'text-blue-600',    bg: 'bg-blue-50',     border: 'border-blue-200' },
    { key: 'completed',   label: 'Completed',   color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
]

const PRIORITY_STYLES = {
    urgent: 'bg-red-50 text-red-600 border-red-200',
    high:   'bg-orange-50 text-orange-600 border-orange-200',
    medium: 'bg-amber-50 text-amber-600 border-amber-200',
    low:    'bg-slate-50 text-slate-500 border-slate-200',
}

const ManagerTasks = () => {
    const { userData } = useContext(Context)
    const [tasks, setTasks]             = useState([])
    const [users, setUsers]             = useState([])
    const [loading, setLoading]         = useState(true)
    const [showCreate, setShowCreate]   = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [chatMessages, setChatMessages] = useState([])
    const [chatLoading, setChatLoading] = useState(false)
    const [newMessage, setNewMessage]   = useState('')
    const [sending, setSending]         = useState(false)
    const messagesEndRef = useRef(null)

    const [newTask, setNewTask] = useState({
        title: '', description: '', assignedTo: '', priority: 'medium', dueDate: ''
    })

    const fetchData = async () => {
        try {
            const [taskRes, userRes] = await Promise.all([
                axios.get('/api/task'),
                axios.get('/api/user')
            ])
            if (taskRes.data.success) setTasks(taskRes.data.data)
            if (userRes.data.success) setUsers(userRes.data.data.filter(u => ['developer', 'support', 'manager'].includes(u.role)))
        } catch {
            toast.error('Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const openChat = async (task) => {
        setSelectedTask(task)
        setChatMessages([])
        setChatLoading(true)
        try {
            const res = await axios.get(`/api/task/${task.task_id}/chat`)
            if (res.data.success) {
                setChatMessages(res.data.data)
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
            }
        } catch {
            toast.error('Failed to load chat')
        } finally {
            setChatLoading(false)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return
        setSending(true)
        try {
            const res = await axios.post(`/api/task/${selectedTask.task_id}/chat`, { message: newMessage })
            if (res.data.success) {
                setChatMessages(prev => [...prev, res.data.data])
                setNewMessage('')
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
            }
        } catch {
            toast.error('Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const handleStatusChange = async (taskId, status) => {
        try {
            await axios.patch('/api/task', { id: taskId, status })
            setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, status } : t))
            if (selectedTask?.task_id === taskId) setSelectedTask(prev => ({ ...prev, status }))
            toast.success('Status updated')
        } catch {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this task? All chat history will be lost.')) return
        try {
            await axios.delete('/api/task', { data: { id } })
            toast.success('Task deleted')
            if (selectedTask?.task_id === id) setSelectedTask(null)
            fetchData()
        } catch {
            toast.error('Failed to delete task')
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/task', newTask)
            toast.success('Task created')
            setShowCreate(false)
            setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' })
            fetchData()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create task')
        }
    }

    const tasksByStatus = (status) => tasks.filter(t => t.status === status)

    const stats = [
        { label: 'Total',       value: tasks.length,                              icon: RiInboxLine },
        { label: 'In Progress', value: tasksByStatus('in_progress').length,       icon: RiTimerLine },
        { label: 'In Review',   value: tasksByStatus('in_review').length,         icon: RiEyeLine },
        { label: 'Completed',   value: tasksByStatus('completed').length,         icon: RiCheckboxCircleLine },
    ]

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="h-full flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Task Board</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Assign and track developer workloads.</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-slate-900 text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                    <RiAddLine size={14} /> New Task
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {stats.map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <s.icon size={16} />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 min-h-0">
                {COLUMNS.map(col => (
                    <div key={col.key} className="flex flex-col bg-white border border-slate-200 overflow-hidden">
                        {/* Column Header */}
                        <div className={`px-4 py-3 border-b border-slate-200 flex items-center justify-between ${col.bg}`}>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${col.color}`}>{col.label}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${col.color} ${col.border} bg-white`}>
                                {tasksByStatus(col.key).length}
                            </span>
                        </div>

                        {/* Task Cards */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {tasksByStatus(col.key).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <RiInboxLine size={20} className="text-slate-200 mb-2" />
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Empty</p>
                                </div>
                            ) : tasksByStatus(col.key).map(task => (
                                <TaskCard
                                    key={task.task_id}
                                    task={task}
                                    isSelected={selectedTask?.task_id === task.task_id}
                                    onOpen={() => openChat(task)}
                                    onDelete={() => handleDelete(task.task_id)}
                                    onStatusChange={handleStatusChange}
                                    columns={COLUMNS}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Panel — slide over */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div className="flex-1 bg-slate-900/30" onClick={() => setSelectedTask(null)} />

                    {/* Panel */}
                    <div className="w-full max-w-xl bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl">
                        {/* Panel Header */}
                        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Task Discussion</p>
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight leading-snug truncate">{selectedTask.title}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${PRIORITY_STYLES[selectedTask.priority] || PRIORITY_STYLES.medium}`}>
                                        {selectedTask.priority}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <RiUserLine size={10} /> {selectedTask.assigned_to_name || 'Unassigned'}
                                    </span>
                                    {selectedTask.due_date && (
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <RiCalendarLine size={10} /> {new Date(selectedTask.due_date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="p-1.5 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shrink-0">
                                <RiCloseLine size={16} />
                            </button>
                        </div>

                        {/* Task Info Bar */}
                        <div className="px-5 py-3 border-b border-slate-100 bg-white">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                                {selectedTask.description || 'No description provided for this task.'}
                            </p>
                        </div>

                        {/* Status Changer */}
                        <div className="px-5 py-2 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Move to:</p>
                            <div className="flex gap-1 flex-wrap">
                                {COLUMNS.filter(c => c.key !== selectedTask.status).map(c => (
                                    <button
                                        key={c.key}
                                        onClick={() => handleStatusChange(selectedTask.task_id, c.key)}
                                        className={`px-2 py-1 border text-[9px] font-bold uppercase tracking-widest transition-all ${c.color} ${c.bg} ${c.border} hover:opacity-80`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {chatLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
                                </div>
                            ) : chatMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 border border-slate-200 bg-slate-50 flex items-center justify-center mb-3">
                                        <RiChat3Line size={20} className="text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                                    <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Start the discussion below.</p>
                                </div>
                            ) : chatMessages.map(msg => {
                                const isMe = msg.sender_id === userData?.id
                                return (
                                    <div key={msg.message_id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1 px-1">
                                            {msg.sender_name} · {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className={`px-3 py-2 border text-[10px] font-bold uppercase tracking-tight max-w-[85%] leading-relaxed ${isMe ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="p-2 bg-slate-900 text-white hover:bg-slate-800 transition-all disabled:opacity-40"
                                >
                                    <RiSendPlaneFill size={16} />
                                </button>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => handleDelete(selectedTask.task_id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
                            >
                                <RiDeleteBinLine size={12} /> Delete Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Task Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="bg-white w-full max-w-lg border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Create New Task</h2>
                            <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-900 transition-all">
                                <RiCloseLine size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Task Title *</label>
                                <input
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="e.g. Implement payment webhook..."
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Detailed instructions for the assignee..."
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Assign To *</label>
                                    <select
                                        required
                                        value={newTask.assignedTo}
                                        onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                    >
                                        <option value="">Select User</option>
                                        {users.map(u => (
                                            <option key={u.user_id} value={u.user_id}>{u.name} ({u.role})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Priority</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Due Date</label>
                                    <input
                                        type="datetime-local"
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-500 font-bold text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all">
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Task Card Component ──────────────────────────────────────────────────────
const TaskCard = ({ task, isSelected, onOpen, onDelete, onStatusChange, columns }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'

    return (
        <div
            className={`bg-white border p-3 cursor-pointer transition-all hover:border-slate-400 group relative ${isSelected ? 'border-slate-900' : isOverdue ? 'border-red-200' : 'border-slate-200'}`}
        >
            {/* Priority bar */}
            <div className={`absolute top-0 left-0 w-0.5 h-full ${task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-200'}`} />

            <div className="pl-2">
                {/* Title & Menu */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <p
                        className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-snug flex-1"
                        onClick={onOpen}
                    >
                        {task.title}
                    </p>
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-0.5 text-slate-300 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <RiMore2Line size={14} />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-5 bg-white border border-slate-200 shadow-lg z-10 min-w-[120px]">
                                {columns.filter(c => c.key !== task.status).map(c => (
                                    <button
                                        key={c.key}
                                        onClick={() => { onStatusChange(task.task_id, c.key); setMenuOpen(false) }}
                                        className={`w-full text-left px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all ${c.color}`}
                                    >
                                        → {c.label}
                                    </button>
                                ))}
                                <div className="border-t border-slate-100" />
                                <button
                                    onClick={() => { onDelete(); setMenuOpen(false) }}
                                    className="w-full text-left px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed mb-2 line-clamp-2">
                        {task.description}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
                            {task.assigned_to_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[60px]">
                            {task.assigned_to_name?.split(' ')[0] || 'None'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {task.due_date && (
                            <span className={`text-[8px] font-bold uppercase tracking-widest flex items-center gap-0.5 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                                <RiCalendarLine size={9} />
                                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                        <button onClick={onOpen} className="p-0.5 text-slate-300 hover:text-slate-700 transition-all">
                            <RiChat3Line size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerTasks
