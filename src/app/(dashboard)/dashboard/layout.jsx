'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Context } from '@/component/helper/Context'
import Sidebar from '@/component/dashboard/Sidebar'
import Topbar from '@/component/dashboard/Topbar'
import { useRouter, usePathname } from 'next/navigation'

const DashboardLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)
    const { isLoggedIn, userData, isLoadingAuth } = useContext(Context)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (isLoadingAuth) return;

        if (!isLoggedIn && !userData?.user_id) {
            return router.push('/login')
        }

        const validStaffRoles = ['admin', 'manager', 'support', 'developer']
        const role = userData?.role

        if (role === 'user') {
            return router.replace('/user')
        }

        if (role && validStaffRoles.includes(role)) {
            const currentRoutePrefix = `/dashboard/${role}`;
            if (role !== 'admin' && !pathname.startsWith(currentRoutePrefix) && pathname !== '/dashboard' && !pathname.startsWith('/dashboard/mail') && !pathname.startsWith('/dashboard/tickets')) {
                router.replace('/dashboard')
            }
        }
    }, [isLoadingAuth, isLoggedIn, userData, pathname, router])

    if (isLoadingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {!collapsed && (
                <div 
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setCollapsed(true)}
                ></div>
            )}
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
