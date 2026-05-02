'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Context } from '@/component/helper/Context'
import UserSidebar from '@/component/dashboard/UserSidebar'
import Topbar from '@/component/dashboard/Topbar'
import { useRouter } from 'next/navigation'
import { RiAlertLine } from 'react-icons/ri'

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
                    <div className="max-w-7xl mx-auto space-y-6">
                        {userData?.hasPastDue && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-pulse">
                                <div className="flex items-center gap-3 text-amber-800">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                        <RiAlertLine size={24} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Action Required: Service Interruption</p>
                                        <p className="text-xs opacity-80">One or more of your subscriptions have expired or been suspended. Renew now to restore full service.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => router.push('/user/subscription')}
                                    className="px-5 py-2.5 bg-amber-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-700 transition-colors whitespace-nowrap"
                                >
                                    Renew Now
                                </button>
                            </div>
                        )}
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
