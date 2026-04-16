'use client'
import React from 'react'

const StatCard = ({ title, value, icon: Icon, color = 'emerald' }) => {
    const colorMap = {
        emerald: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    }

    const currentColor = colorMap[color] || colorMap.emerald

    return (
        <div className="card-premium p-8 group">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentColor} flex-shrink-0`}>
                    <Icon size={28} />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                        {title}
                    </p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter mt-1">
                        {value || 0}
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default StatCard


