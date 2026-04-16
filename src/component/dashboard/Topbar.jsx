'use client'
import React, { useContext } from 'react'
import { Context } from '@/component/helper/Context'
import { RiSearchLine, RiNotification3Line, RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri'

const Topbar = ({ collapsed, setCollapsed }) => {
    const { userData } = useContext(Context)

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 transition-all duration-300">
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-colors"
                >
                    {collapsed ? <RiMenuUnfoldLine size={24} /> : <RiMenuFoldLine size={24} />}
                </button>
                
                <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 w-80 transition-all focus-within:bg-white focus-within:border-emerald-200 focus-within:shadow-sm focus-within:shadow-emerald-100">
                    <RiSearchLine size={20} className="text-slate-400" />
                    <input 
                        type="text" 
                        className="bg-transparent border-none outline-none text-sm text-slate-700 font-medium w-full placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-3 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl relative transition-all">
                    <RiNotification3Line size={22} />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                </button>

                <div className="w-px h-8 bg-slate-100 mx-1"></div>

                <div className="flex items-center gap-4 pl-2 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                            {userData?.name || 'User'}
                        </div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">
                            {userData?.role || 'Client'}
                        </div>
                    </div>
                    <div className="w-11 h-11 rounded-[1.125rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md group-hover:shadow-emerald-500/20 transition-all">
                        {userData?.image ? (
                            <img src={userData.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-emerald-600 font-black text-lg">{userData?.name?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Topbar

