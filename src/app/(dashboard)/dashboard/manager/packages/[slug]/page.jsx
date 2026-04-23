'use client'
import React, { useState, useEffect } from 'react'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'
import axios from 'axios'
import { useParams } from 'next/navigation'
import UpdatePackageForm from '@/component/forms/UpdatePackageForm'

const EditPackagePage = () => {
    const { slug } = useParams()
    const [Package, setPackage] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const res = await axios.get(`/api/package/${slug}`)
                if (res.data.success) {
                    setPackage(res.data.data) 
                }
            } catch (error) {
                console.error('Failed to fetch Package', error)
            } finally {
                setLoading(false)
            }
        }
        
        if (slug) fetchPackage()
    }, [slug])

    if (loading) return (
        <div className="flex items-center justify-center min-h-100">
            <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    if (!Package) return (
        <div className="p-10 text-center font-bold text-slate-400 uppercase tracking-widest">
            Package Not Found
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/manager/packages" 
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to Packages
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Modify Package</h1>
                    <p className="text-slate-500 font-medium">Update the details of this Package.</p>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                
                <UpdatePackageForm pack={Package} />
            </div>
        </div>
    )
}

export default EditPackagePage