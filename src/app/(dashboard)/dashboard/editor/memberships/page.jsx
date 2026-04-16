'use client'
import React from 'react'
import DataTable from '@/component/dashboard/DataTable'
import { RiEdit2Line, RiInformationLine } from 'react-icons/ri'

const EditorMemberships = () => {
    // Mock data since API is missing
    const mockPlans = [
        { title: 'Starter', price: 99, status: 'active', features: 'Basic projects, Support' },
        { title: 'Business', price: 199, status: 'active', features: 'All projects, Priority support' },
        { title: 'Enterprise', price: 299, status: 'active', features: 'Unlimited everything' },
    ]

    const columns = [
        { label: 'Plan Name', key: 'title', render: (row) => (
            <span className="font-bold text-slate-700">{row.title}</span>
        )},
        { label: 'Base Price', key: 'price', render: (row) => (
            <span className="font-bold text-slate-900">${row.price}</span>
        )},
        { label: 'Features', key: 'features', render: (row) => (
            <p className="text-slate-500 max-w-xs truncate">{row.features}</p>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all">
                <RiEdit2Line size={18} />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all">
                <RiInformationLine size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Membership Plans</h1>
                <p className="text-slate-500">View and adjust the tier structures and pricing features.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <div className="p-6 bg-amber-50 border-b border-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <RiInformationLine size={16} />
                    <span>Mode: View Only (Plan updates are currently handled by Admin)</span>
                </div>
                <DataTable columns={columns} data={mockPlans} loading={false} actions={actions} />
            </div>
        </div>
    )
}

export default EditorMemberships
