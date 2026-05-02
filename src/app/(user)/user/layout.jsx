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
                <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
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
                            <div className="bg-amber-50 border border-amber-300 p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-amber-800">
                                    <RiAlertLine size={18} className="text-amber-600 shrink-0" />
                                    <div>
                                        <p className="font-bold text-xs uppercase tracking-widest text-amber-800">Action Required: Service Interruption</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 opacity-80 mt-0.5">One or more subscriptions have expired. Renew now to restore service.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/user/subscription')}
                                    className="px-4 py-2 bg-amber-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors whitespace-nowrap"
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
