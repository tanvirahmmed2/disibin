'use client'
import React from 'react'

const StatCard = ({ title, value, icon: Icon, trend, color = 'emerald' }) => {
    const colorMap = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    }

    const currentColor = colorMap[color] || colorMap.emerald

    return (
        <div className="card-premium p-6 group">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl border ${currentColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={28} />
                </div>
                {trend && (
                    <div className={`text-xs font-black px-3 py-1.5 rounded-full ${trend.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {trend.positive ? '↑' : '↓'} {trend.value}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-emerald-600 transition-colors">
                    {title}
                </p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
                    {value || 0}
                </h3>
            </div>
            <div className="mt-4 h-1 w-0 group-hover:w-full bg-emerald-500 rounded-full transition-all duration-500 opacity-20"></div>
        </div>
    )
}

export default StatCard

