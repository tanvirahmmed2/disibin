'use client'
import React from 'react'
import AddNewBlogForm from '@/component/forms/AddNewBlogForm'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'

const NewBlogPage = () => {
    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
                <Link 
                    href="/dashboard/manager/blogs" 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-[10px] uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={14} /> Back to Blogs
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">New Blog</h1>
                    <p className="text-xs text-slate-500">Create and publish high-quality content for the platform blog.</p>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200">
                <AddNewBlogForm />
            </div>
        </div>
    )
}

export default NewBlogPage
