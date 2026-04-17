'use client'
import React from 'react'

const StatCard = ({ title, value, icon: Icon, color = 'emerald' }) => {
    

   
    return (
        <div className="card-premium p-8 group">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center  shrink-0`}>
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


