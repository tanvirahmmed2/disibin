"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus, FaCalendarAlt, FaSpinner, FaUserCircle, FaTasks, FaEdit } from "react-icons/fa";

const STATUS_STYLES = {
    pending: "bg-slate-100 text-slate-600",
    in_progress: "bg-blue-100 text-blue-700",
    review: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700"
};

const PRIORITY_STYLES = {
    low: "text-slate-400",
    medium: "text-blue-500",
    high: "text-orange-500",
    urgent: "text-red-500 font-bold"
};

export default function ManagerProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // New Task State
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskPriority, setTaskPriority] = useState("medium");
    const [taskAssignedTo, setTaskAssignedTo] = useState("");
    const [taskDeadline, setTaskDeadline] = useState("");
    const [creatingTask, setCreatingTask] = useState(false);

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        setLoading(true);
        try {
            const [projRes, tasksRes] = await Promise.all([
                axios.get(`/api/projects/${id}`),
                axios.get(`/api/projects/${id}/tasks`)
            ]);
            
            if (projRes.data.success) setProject(projRes.data.data);
            if (tasksRes.data.success) setTasks(tasksRes.data.data);
        } catch (error) {
            toast.error("Failed to load project details");
            if (error.response?.status === 403 || error.response?.status === 404) {
                router.push("/dashboard/manager/projects");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProjectStatus = async (status) => {
        try {
            const res = await axios.patch(`/api/projects/${id}`, { status });
            if (res.data.success) {
                toast.success("Status updated");
                setProject(prev => ({ ...prev, status }));
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!taskTitle) return toast.error("Title is required");

        setCreatingTask(true);
        try {
            const payload = {
                title: taskTitle,
                description: taskDesc,
                priority: taskPriority,
                assigned_to: taskAssignedTo || null,
                deadline: taskDeadline || null
            };
            const res = await axios.post(`/api/projects/${id}/tasks`, payload);
            if (res.data.success) {
                toast.success("Task created");
                setShowTaskModal(false);
                setTaskTitle(""); setTaskDesc(""); setTaskAssignedTo(""); setTaskDeadline(""); setTaskPriority("medium");
                
                // Refresh tasks
                const tasksRes = await axios.get(`/api/projects/${id}/tasks`);
                if (tasksRes.data.success) setTasks(tasksRes.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setCreatingTask(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" /></div>;
    }

    if (!project) return null;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <Link href="/dashboard/manager/projects" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                    <FaArrowLeft size={12} />
                </Link>
                <div className="text-sm font-medium text-slate-500">Back to Projects</div>
            </div>

            {/* Project Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-slate-800">{project.title}</h1>
                            <select 
                                value={project.status}
                                onChange={(e) => handleUpdateProjectStatus(e.target.value)}
                                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-0 ${
                                    project.status === 'active' ? 'bg-amber-100 text-amber-700' :
                                    project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-slate-100 text-slate-600'
                                }`}
                            >
                                <option value="active">Active</option>
                                <option value="on_hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <p className="text-slate-600 mb-6">{project.description || "No description provided."}</p>
                        
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><FaCalendarAlt size={14} /></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deadline</p>
                                    <p className="text-sm font-medium text-slate-700">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><FaUserCircle size={16} /></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Created By</p>
                                    <p className="text-sm font-medium text-slate-700">{project.creator_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-64 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Assigned Developers</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                            {project.developers && project.developers.length > 0 ? (
                                project.developers.map(dev => (
                                    <div key={dev.user_id} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                                            {dev.name.charAt(0)}
                                        </div>
                                        {dev.name}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic">No developers assigned.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks Section */}
            <div>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaTasks className="text-slate-400" /> Project Tasks
                    </h2>
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
                    >
                        <FaPlus size={10} /> Add Task
                    </button>
                </div>

                {tasks.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                        <div className="w-12 h-12 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FaTasks size={20} />
                        </div>
                        <p className="text-slate-500 font-medium">No tasks created yet</p>
                        <p className="text-xs text-slate-400 mt-1">Break down this project into smaller tasks for your developers.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                                    <th className="p-4 font-bold">Task</th>
                                    <th className="p-4 font-bold">Priority</th>
                                    <th className="p-4 font-bold">Assigned To</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold">Deadline</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {tasks.map(task => (
                                    <tr key={task.task_id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <p className="font-semibold text-slate-800 mb-0.5">{task.title}</p>
                                            <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{task.description}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`capitalize ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                                        </td>
                                        <td className="p-4">
                                            {task.assigned_name ? (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                                                        {task.assigned_name.charAt(0)}
                                                    </div>
                                                    <span className="text-slate-700 font-medium">{task.assigned_name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${STATUS_STYLES[task.status]}`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="p-4 text-right">
                                           {/* The manager doesn't necessarily chat from here, but they can view it. We can add a link to Task Chat later. */}
                                            <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded-full font-bold">{task.comments_count || 0} comments</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-800">Add New Task</h2>
                            <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-700 transition">✕</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="createTaskForm" onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" required
                                        value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="e.g. Design Database Schema"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                                    <textarea 
                                        value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                                        placeholder="Detailed requirements..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
                                        <select 
                                            value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deadline</label>
                                        <input 
                                            type="date"
                                            value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Developer</label>
                                    <select 
                                        value={taskAssignedTo} onChange={(e) => setTaskAssignedTo(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    >
                                        <option value="">-- Unassigned --</option>
                                        {project.developers && project.developers.map(dev => (
                                            <option key={dev.user_id} value={dev.user_id}>{dev.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-400 mt-1">Only developers assigned to this project can be selected.</p>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                            <button type="button" onClick={() => setShowTaskModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
                            <button type="submit" form="createTaskForm" disabled={creatingTask} className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
                                {creatingTask ? <><FaSpinner className="animate-spin" /> Creating...</> : "Create Task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
