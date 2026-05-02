'use client'
import React from 'react'

const DataTable = ({ columns, data, loading, actions }) => {
    if (loading) return (
        <div className="w-full bg-white border border-slate-200 p-12 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Loading...</p>
        </div>
    )

    if (!data || data.length === 0) return (
        <div className="w-full bg-white border border-slate-200 p-16 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No data available</p>
        </div>
    )

    return (
        <div className="w-full overflow-x-auto bg-white border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-6 py-4 text-xs text-slate-700 font-bold uppercase tracking-tight">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {actions(row)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DataTable
