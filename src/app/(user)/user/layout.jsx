'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Context } from '@/component/helper/Context'
import UserSidebar from '@/component/dashboard/UserSidebar'
import Topbar from '@/component/dashboard/Topbar'
import { useRouter } from 'next/navigation'

const UserLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)
    const { isLoggedIn, userData, isLoadingAuth } = useContext(Context)
    const router = useRouter()

    useEffect(() => {
        if (!isLoadingAuth && !isLoggedIn && !userData?.user_id) {
            return router.push('/login')
        }
    }, [isLoadingAuth, isLoggedIn, userData, router])

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
            <UserSidebar collapsed={collapsed} />
            
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
                
                <main className="p-4 md:p-8 flex-1">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="px-8 py-6 text-sm text-slate-400 border-t border-slate-50">
                    &copy; {new Date().getFullYear()} Disibin. All rights reserved.
                </footer>
            </div>
        </div>
    )
}

export default UserLayout
