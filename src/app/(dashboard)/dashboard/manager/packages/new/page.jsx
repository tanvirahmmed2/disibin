'use client'
import React from 'react'
import AddNewPackage from '@/component/forms/AddNewPackage'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'

const NewPackagePage = () => {
    return (
        <div className="space-y-6 py-6 px-4 w-full">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/manager/packages" 
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to Packages
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-800">Create New Package</h1>
                    <p className="text-sm text-slate-500">Define pricing, category, and features for a new service offer.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full">
                <AddNewPackage />
            </div>
        </div>
    )
}

export default NewPackagePage