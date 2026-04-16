'use client'
import React from 'react'
import DataTable from '@/component/dashboard/DataTable'
import { RiCheckboxCircleFill, RiTimeLine, RiChatForwardLine } from 'react-icons/ri'

const StaffDashboard = () => {
    // Mock tasks data for now as specific Task API for staff might be custom
    const mockTasks = [
        { id: 1, title: 'Update Blog Images', project: 'SaaS Platform', deadline: '2026-04-20', status: 'In Progress' },
        { id: 2, title: 'Fix CSS Grid on Dashboard', project: 'Disibin Next', deadline: '2026-04-15', status: 'High Priority' },
        { id: 3, title: 'Verify Client Payments', project: 'System Internal', deadline: '2026-04-14', status: 'Urgent' },
    ]

    const columns = [
        { label: 'Task Name', key: 'title', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.title}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.project}</span>
            </div>
        )},
        { label: 'Deadline', key: 'deadline', render: (row) => (
            <div className="flex items-center gap-1.5 text-slate-500">
                <RiTimeLine className="text-amber-500" />
                <span className="text-sm font-medium">{new Date(row.deadline).toLocaleDateString()}</span>
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                ${row.status.includes('Priority') || row.status === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all font-bold text-xs flex items-center gap-1">
                <RiCheckboxCircleFill size={18} /> Done
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all">
                <RiChatForwardLine size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Assigned Tasks</h1>
                <p className="text-slate-500">Track your progress and communicate updates on your current assignments.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={mockTasks} loading={false} actions={actions} />
            </div>
        </div>
    )
}

export default StaffDashboard
