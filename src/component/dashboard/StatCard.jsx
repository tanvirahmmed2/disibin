'use client'
import React from 'react'

const StatCard = ({ title, value, icon: Icon }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/10 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Icon size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest truncate">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                        {value || 0}
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default StatCard
