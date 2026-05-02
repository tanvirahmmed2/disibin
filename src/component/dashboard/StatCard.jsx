'use client'
import React from 'react'

const StatCard = ({ title, value, icon: Icon }) => {
    return (
        <div className="bg-white p-6 border border-slate-200 group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:border-slate-400 group-hover:text-slate-800 transition-all">
                    <Icon size={20} />
                </div>
                <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                        {title}
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none mt-1">
                        {value || 0}
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default StatCard
