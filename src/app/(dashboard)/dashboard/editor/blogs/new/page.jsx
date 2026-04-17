'use client'
import React from 'react'
import AddNewBlogForm from '@/component/forms/AddNewBlogForm'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'

const NewBlogPage = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/editor/blogs" 
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to Repository
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compose New Article</h1>
                    <p className="text-slate-500 font-medium">Create and publish high-quality content for the platform blog.</p>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                <AddNewBlogForm />
            </div>
        </div>
    )
}

export default NewBlogPage
