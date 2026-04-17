'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Context } from '@/component/helper/Context'
import Sidebar from '@/component/dashboard/Sidebar'
import Topbar from '@/component/dashboard/Topbar'
import { useRouter, usePathname } from 'next/navigation'

const DashboardLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)
    const { isLoggedin, userData } = useContext(Context)
    const router = useRouter()

    
    
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoggedin && !userData?._id) return

        
        const managementRoutes = ['/dashboard/admin', '/dashboard/manager', '/dashboard/support', '/dashboard/project-manager', '/dashboard/editor', '/dashboard/staff'];
        const isManagementRoute = managementRoutes.some(route => pathname.startsWith(route));

        if (userData?.role === 'client' && isManagementRoute) {
            router.replace('/dashboard')
        }

        
        if (userData?.role && isManagementRoute) {
            const currentRoutePrefix = `/dashboard/${userData.role.replace('_', '-')}`;
            if (userData.role !== 'admin' && !pathname.startsWith(currentRoutePrefix) && !pathname.startsWith('/dashboard/support') && !pathname.startsWith('/dashboard/mail')) {
                
                if (isManagementRoute) {
                    router.replace('/dashboard')
                }
            }
        }
    }, [isLoggedin, userData, pathname, router])

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
