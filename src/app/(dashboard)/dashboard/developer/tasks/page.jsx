'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import {
    RiTaskLine,
    RiChat3Line,
    RiSendPlaneFill,
    RiCloseLine,
    RiCalendarLine,
    RiCheckLine,
    RiTimerLine,
    RiEyeLine,
    RiInboxLine,
    RiArrowRightSLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
    pending:     { label: 'Pending',     color: 'text-slate-500',   bg: 'bg-slate-50',    border: 'border-slate-200' },
    in_progress: { label: 'In Progress', color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200' },
    in_review:   { label: 'In Review',   color: 'text-blue-600',    bg: 'bg-blue-50',     border: 'border-blue-200' },
    completed:   { label: 'Completed',   color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
}

const PRIORITY_BAR = {
    urgent: 'bg-red-500',
    high:   'bg-orange-400',
    medium: 'bg-amber-400',
    low:    'bg-slate-300',
}

const STATUS_TRANSITIONS = {
    pending:     ['in_progress'],
    in_progress: ['in_review', 'pending'],
    in_review:   ['completed', 'in_progress'],
    completed:   [],
}

const DeveloperTasks = () => {
    const { userData } = useContext(Context)
    const [tasks, setTasks]               = useState([])
    const [loading, setLoading]           = useState(true)
    const [selectedTask, setSelectedTask] = useState(null)
    const [chatMessages, setChatMessages] = useState([])
    const [chatLoading, setChatLoading]   = useState(false)
    const [newMessage, setNewMessage]     = useState('')
    const [sending, setSending]           = useState(false)
    const [filter, setFilter]             = useState('all')
    const messagesEndRef = useRef(null)

    const fetchTasks = async () => {
        try {
            const res = await axios.get('/api/task')
            if (res.data.success) setTasks(res.data.data)
        } catch {
            toast.error('Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchTasks() }, [])

    const openTask = async (task) => {
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
            toast.error('Failed to send')
        } finally {
            setSending(false)
        }
    }

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await axios.patch('/api/task', { id: taskId, status: newStatus })
            setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, status: newStatus } : t))
            if (selectedTask?.task_id === taskId) setSelectedTask(prev => ({ ...prev, status: newStatus }))
            toast.success('Status updated')
        } catch {
            toast.error('Failed to update status')
        }
    }

    const filteredTasks = filter === 'all'
        ? tasks
        : tasks.filter(t => t.status === filter)

    const counts = {
        all:         tasks.length,
        pending:     tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        in_review:   tasks.filter(t => t.status === 'in_review').length,
        completed:   tasks.filter(t => t.status === 'completed').length,
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="flex flex-col gap-4 h-full">

            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">My Tasks</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Your assigned workload — {tasks.length} task{tasks.length !== 1 ? 's' : ''} total.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 flex-wrap">
                {[
                    { key: 'all',         label: 'All',         icon: RiInboxLine },
                    { key: 'pending',     label: 'Pending',     icon: RiTaskLine },
                    { key: 'in_progress', label: 'In Progress', icon: RiTimerLine },
                    { key: 'in_review',   label: 'In Review',   icon: RiEyeLine },
                    { key: 'completed',   label: 'Completed',   icon: RiCheckLine },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest transition-all ${
                            filter === tab.key
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                        }`}
                    >
                        <tab.icon size={11} />
                        {tab.label}
                        <span className={`text-[8px] px-1 py-0.5 font-bold ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Main Layout: Task List + Chat Panel */}
            <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">

                {/* Task List */}
                <div className={`flex flex-col gap-2 overflow-y-auto transition-all ${selectedTask ? 'w-full md:w-2/5' : 'w-full'}`}>
                    {filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border border-slate-200 bg-white text-center">
                            <RiInboxLine size={28} className="text-slate-200 mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No tasks found</p>
                        </div>
                    ) : filteredTasks.map(task => {
                        const st = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending
                        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
                        const isActive = selectedTask?.task_id === task.task_id
                        const nextStatuses = STATUS_TRANSITIONS[task.status] || []

                        return (
                            <div
                                key={task.task_id}
                                className={`bg-white border transition-all relative overflow-hidden ${isActive ? 'border-slate-900' : isOverdue ? 'border-red-200' : 'border-slate-200'}`}
                            >
                                {/* Priority strip */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${PRIORITY_BAR[task.priority] || 'bg-slate-200'}`} />

                                <div className="pl-4 pr-3 py-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            {/* Title */}
                                            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight leading-snug mb-1">
                                                {task.title}
                                            </p>
                                            {task.description && (
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed line-clamp-1 mb-2">
                                                    {task.description}
                                                </p>
                                            )}

                                            {/* Meta row */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${st.color} ${st.bg} ${st.border}`}>
                                                    {st.label}
                                                </span>
                                                <span className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${
                                                    task.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-200' :
                                                    task.priority === 'high'   ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                                {task.due_date && (
                                                    <span className={`text-[8px] font-bold uppercase tracking-widest flex items-center gap-0.5 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                                                        <RiCalendarLine size={9} />
                                                        {isOverdue ? 'Overdue · ' : ''}
                                                        {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                                    By {task.created_by_name || 'System'}
                                                </span>
                                            </div>

                                            {/* Status transitions */}
                                            {nextStatuses.length > 0 && (
                                                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-50">
                                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Move to:</span>
                                                    {nextStatuses.map(ns => {
                                                        const nst = STATUS_CONFIG[ns]
                                                        return (
                                                            <button
                                                                key={ns}
                                                                onClick={() => handleStatusUpdate(task.task_id, ns)}
                                                                className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest transition-all ${nst.color} ${nst.bg} ${nst.border} hover:opacity-80`}
                                                            >
                                                                {nst.label}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Chat button */}
                                        <button
                                            onClick={() => isActive ? setSelectedTask(null) : openTask(task)}
                                            className={`p-1.5 border transition-all flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest shrink-0 ${
                                                isActive
                                                    ? 'bg-slate-900 border-slate-900 text-white'
                                                    : 'border-slate-200 text-slate-400 hover:border-slate-700 hover:text-slate-700'
                                            }`}
                                        >
                                            <RiChat3Line size={12} />
                                            {!isActive && <RiArrowRightSLine size={10} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Chat Panel */}
                {selectedTask && (
                    <div className="hidden md:flex flex-col flex-1 bg-white border border-slate-200 min-h-0 overflow-hidden">

                        {/* Chat Header */}
                        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3 shrink-0">
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Discussion</p>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight leading-snug truncate">{selectedTask.title}</h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    {(() => {
                                        const st = STATUS_CONFIG[selectedTask.status]
                                        return <span className={`px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${st.color} ${st.bg} ${st.border}`}>{st.label}</span>
                                    })()}
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                        {selectedTask.priority} priority
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="p-1.5 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shrink-0"
                            >
                                <RiCloseLine size={14} />
                            </button>
                        </div>

                        {/* Description */}
                        {selectedTask.description && (
                            <div className="px-5 py-3 border-b border-slate-100 shrink-0">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                                    {selectedTask.description}
                                </p>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
                                </div>
                            ) : chatMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                                    <div className="w-10 h-10 border border-slate-200 bg-slate-50 flex items-center justify-center mb-3">
                                        <RiChat3Line size={16} className="text-slate-300" />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                                    <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-1">Ask a question below.</p>
                                </div>
                            ) : chatMessages.map(msg => {
                                const isMe = msg.sender_id === userData?.id
                                return (
                                    <div key={msg.message_id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1 px-1">
                                            {msg.sender_name} · {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className={`px-3 py-2 border text-[10px] font-bold max-w-[85%] leading-relaxed ${isMe ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-slate-200 shrink-0">
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
                                    <RiSendPlaneFill size={14} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DeveloperTasks
