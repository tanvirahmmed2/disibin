'use client'
import React from 'react'
import AddNewProjectForm from '@/component/forms/AddNewProjectForm'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'

const NewProjectPage = () => {
    return (
        <div className="space-y-6 py-6 px-4">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/manager/projects" 
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to Portfolio
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-800">New Project Case</h1>
                    <p className="text-sm text-slate-500">Showcase a new successful project in the platform portfolio.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl">
                <AddNewProjectForm />
            </div>
        </div>
    )
}

export default NewProjectPage
