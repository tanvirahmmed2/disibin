'use client'
import React from 'react'
import AddNewPackage from '@/component/forms/AddNewPackage'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'

const NewPackagePage = () => {
    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
                <Link 
                    href="/dashboard/manager/packages" 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-[10px] uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={14} /> Back to Packages
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">New Package</h1>
                    <p className="text-xs text-slate-500">Define pricing, category, and features for a new service offer.</p>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200">
                <AddNewPackage />
            </div>
        </div>
    )
}

export default NewPackagePage