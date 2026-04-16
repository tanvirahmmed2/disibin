'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Context } from '@/component/helper/Context'
import Sidebar from '@/component/dashboard/Sidebar'
import Topbar from '@/component/dashboard/Topbar'
import { useRouter } from 'next/navigation'

const DashboardLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)
    const { isLoggedin, userData } = useContext(Context)
    const router = useRouter()

    
    
    useEffect(() => {
        
        const timeout = setTimeout(() => {
            if (!isLoggedin && !userData?.role) {
                
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [isLoggedin, userData, router])

    return (
        <div className="flex min-h-screen bg-[#FDFDFF]">
            <Sidebar collapsed={collapsed} />
            
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
                
                <main className="p-4 md:p-8 flex-1">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="px-8 py-6 text-sm text-slate-400 border-t border-slate-50">
                    &copy; {new Date().getFullYear()} Disibin Dashboard. All rights reserved.
                </footer>
            </div>
        </div>
    )
}

export default DashboardLayout
