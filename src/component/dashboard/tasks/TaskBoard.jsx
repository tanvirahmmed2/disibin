"use client";
// currentUserId is fetched from /api/user/me if not passed as a prop

import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTimes, FaFlag, FaUser, FaCalendar, FaComments, FaPaperPlane, FaCircle, FaEdit, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'in_progress', 'in_review', 'completed'];
const STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    in_review: 'In Review',
    completed: 'Completed'
};
const STATUS_COLORS = {
    pending: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
    in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    in_review: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
};
const PRIORITY_COLORS = {
    low: 'text-gray-400',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-600',
};

export default function TaskBoard({ role, userId: propUserId }) {
    const [currentUserId, setCurrentUserId] = useState(propUserId || null);
    const [currentRole, setCurrentRole] = useState(role || null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [managementUsers, setManagementUsers] = useState([]);

    // Task detail panel state
    const [taskMessages, setTaskMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);

    // Create task form state
    const [form, setForm] = useState({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
    const [creating, setCreating] = useState(false);

    const canCreate = (currentRole || role) === 'admin' || (currentRole || role) === 'manager';

    useEffect(() => {
        fetchCurrentUser();
        fetchTasks();
    }, []);
    useEffect(() => {
        if (selectedTask) {
            fetchTaskMessages(selectedTask.task_id);
        }
    }, [selectedTask]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [taskMessages]);

    const fetchCurrentUser = async () => {
        if (propUserId) return;
        try {
            const res = await fetch('/api/user/me');
            const data = await res.json();
            if (data.success) {
                setCurrentUserId(data.data.id);
                setCurrentRole(data.data.role);
            }
        } catch (e) {}
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/task');
            const data = await res.json();
            if (data.success) setTasks(data.data);
            else toast.error(data.message || 'Failed to load tasks');
        } catch (e) {
            toast.error('Error loading tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchTaskMessages = async (taskId) => {
        setLoadingMessages(true);
        try {
            const res = await fetch(`/api/task/${taskId}/chat`);
            const data = await res.json();
            if (data.success) setTaskMessages(data.data);
            else toast.error(data.message);
        } catch (e) {
            toast.error('Error loading messages');
        } finally {
            setLoadingMessages(false);
        }
    };

    const openTaskDetail = async (task) => {
        setSelectedTask(task);
    };

    const closeTaskDetail = () => {
        setSelectedTask(null);
        setTaskMessages([]);
        setNewMessage('');
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTask) return;
        try {
            const res = await fetch(`/api/task/${selectedTask.task_id}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage })
            });
            const data = await res.json();
            if (data.success) {
                setTaskMessages(prev => [...prev, data.data]);
                setNewMessage('');
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            toast.error('Error sending message');
        }
    };

    const updateStatus = async (taskId, status) => {
        try {
            const res = await fetch(`/api/task/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Status updated');
                setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, status } : t));
                if (selectedTask?.task_id === taskId) setSelectedTask(prev => ({ ...prev, status }));
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            toast.error('Error updating status');
        }
    };

    const openCreateModal = async () => {
        setShowCreateModal(true);
        if (managementUsers.length === 0) {
            try {
                const res = await fetch('/api/user/management');
                const data = await res.json();
                if (data.success) {
                    // Filter to only developer and support for task assignment
                    setManagementUsers(data.data.filter(u => u.role === 'developer' || u.role === 'support'));
                }
            } catch (e) {
                toast.error('Error loading users');
            }
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!form.title || !form.assigned_to) {
            toast.error('Title and assignee are required');
            return;
        }
        setCreating(true);
        try {
            const res = await fetch('/api/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, assigned_to: parseInt(form.assigned_to) })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Task created!');
                setShowCreateModal(false);
                setForm({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
                fetchTasks();
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            toast.error('Error creating task');
        } finally {
            setCreating(false);
        }
    };

    const tasksByStatus = STATUSES.reduce((acc, s) => {
        acc[s] = tasks.filter(t => t.status === s);
        return acc;
    }, {});

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date';
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Task Board</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
                </div>
                {canCreate && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium text-sm"
                    >
                        <FaPlus size={12} /> New Task
                    </button>
                )}
            </div>

            {/* Kanban Board */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-4 gap-4 overflow-x-auto min-h-0">
                    {STATUSES.map(status => {
                        const col = STATUS_COLORS[status];
                        const colTasks = tasksByStatus[status];
                        return (
                            <div key={status} className={`flex flex-col rounded-xl border ${col.border} ${col.bg} min-w-[220px]`}>
                                {/* Column Header */}
                                <div className="p-3 flex items-center gap-2 border-b border-inherit">
                                    <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                                    <h3 className={`font-semibold text-sm ${col.text}`}>{STATUS_LABELS[status]}</h3>
                                    <span className={`ml-auto text-xs font-bold ${col.text} bg-white/70 rounded-full px-2 py-0.5 border border-inherit`}>
                                        {colTasks.length}
                                    </span>
                                </div>
                                {/* Task Cards */}
                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {colTasks.length === 0 && (
                                        <p className="text-xs text-center text-gray-400 py-6">No tasks</p>
                                    )}
                                    {colTasks.map(task => (
                                        <div
                                            key={task.task_id}
                                            onClick={() => openTaskDetail(task)}
                                            className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-1 mb-2">
                                                <h4 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">{task.title}</h4>
                                                <FaFlag className={`flex-shrink-0 mt-0.5 ${PRIORITY_COLORS[task.priority]}`} size={11} />
                                            </div>
                                            {task.description && (
                                                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{task.description}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <FaUser size={10} />
                                                    <span className="truncate max-w-[80px]">{task.assigned_to_name || 'Unassigned'}</span>
                                                </div>
                                                {task.due_date && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <FaCalendar size={9} />
                                                        <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Task Detail Drawer */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl overflow-hidden">
                        {/* Drawer Header */}
                        <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-white">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selectedTask.status].bg} ${STATUS_COLORS[selectedTask.status].text} border ${STATUS_COLORS[selectedTask.status].border}`}>
                                        {STATUS_LABELS[selectedTask.status]}
                                    </span>
                                    <span className={`text-xs font-medium capitalize flex items-center gap-1 ${PRIORITY_COLORS[selectedTask.priority]}`}>
                                        <FaFlag size={10} /> {selectedTask.priority}
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">{selectedTask.title}</h2>
                            </div>
                            <button onClick={closeTaskDetail} className="text-gray-400 hover:text-gray-700 mt-1 flex-shrink-0">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {/* Task Info */}
                            <div className="p-5 space-y-4 border-b border-gray-100">
                                {selectedTask.description && (
                                    <p className="text-sm text-gray-600 leading-relaxed">{selectedTask.description}</p>
                                )}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">Assigned To</p>
                                        <p className="font-semibold text-gray-800">{selectedTask.assigned_to_name || '—'}</p>
                                        {selectedTask.assigned_to_role && <p className="text-xs text-gray-500 capitalize">{selectedTask.assigned_to_role}</p>}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">Created By</p>
                                        <p className="font-semibold text-gray-800">{selectedTask.created_by_name || '—'}</p>
                                        {selectedTask.created_by_role && <p className="text-xs text-gray-500 capitalize">{selectedTask.created_by_role}</p>}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">Due Date</p>
                                        <p className="font-medium text-gray-700">{formatDate(selectedTask.due_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium mb-0.5">Created</p>
                                        <p className="font-medium text-gray-700">{formatDate(selectedTask.created_at)}</p>
                                    </div>
                                </div>

                                {/* Status Changer */}
                                <div>
                                    <p className="text-xs text-gray-400 font-medium mb-2">Update Status</p>
                                    <div className="flex flex-wrap gap-2">
                                        {STATUSES.map(s => {
                                            const c = STATUS_COLORS[s];
                                            const isActive = selectedTask.status === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => !isActive && updateStatus(selectedTask.task_id, s)}
                                                    disabled={isActive}
                                                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${isActive ? `${c.bg} ${c.text} ${c.border} ring-2 ring-offset-1 ring-blue-400 cursor-default` : `bg-white text-gray-500 border-gray-200 hover:${c.bg} hover:${c.text} hover:${c.border}`}`}
                                                >
                                                    {isActive && <FaCheck className="inline mr-1" size={9} />}
                                                    {STATUS_LABELS[s]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Task Chat */}
                            <div className="flex flex-col">
                                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <FaComments className="text-blue-500" size={16} />
                                    <h3 className="font-semibold text-gray-800 text-sm">Task Discussion</h3>
                                    <span className="ml-auto text-xs text-gray-400">{taskMessages.length} message{taskMessages.length !== 1 ? 's' : ''}</span>
                                </div>

                                <div className="p-4 space-y-3 min-h-[200px] bg-gray-50/50">
                                    {loadingMessages ? (
                                        <div className="flex justify-center py-6 text-gray-400 text-sm">Loading messages...</div>
                                    ) : taskMessages.length === 0 ? (
                                        <div className="flex flex-col items-center py-8 text-gray-400">
                                            <FaComments size={28} className="mb-2 text-gray-300" />
                                            <p className="text-sm">No discussion yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        taskMessages.map((msg, i) => {
                                            const isMe = msg.user_id === (currentUserId || propUserId);
                                            return (
                                                <div key={msg.message_id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="text-xs font-medium text-gray-600">{msg.user_name}</span>
                                                        <span className="text-[10px] text-gray-400 capitalize">({msg.user_role})</span>
                                                    </div>
                                                    <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'}`}>
                                                        {msg.message}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 mt-1">{formatTime(msg.created_at)}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Write a message..."
                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                                >
                                    <FaPaperPlane size={14} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Task Modal */}
            {showCreateModal && canCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Create New Task</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <form onSubmit={createTask} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Task Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. Fix login page bug"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Task details..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Assign To *</label>
                                <select
                                    value={form.assigned_to}
                                    onChange={e => setForm(p => ({ ...p, assigned_to: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a team member...</option>
                                    {managementUsers.map(u => (
                                        <option key={u.user_id} value={u.user_id}>
                                            {u.name} ({u.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                                    <select
                                        value={form.priority}
                                        onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={form.due_date}
                                        onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 shadow-sm"
                                >
                                    {creating ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
