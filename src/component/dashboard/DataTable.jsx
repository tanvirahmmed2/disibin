'use client'
import React from 'react'

const DataTable = ({ columns, data, loading, actions }) => {
    if (loading) return (
        <div className="w-full bg-white rounded-xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Retrieving Records</p>
        </div>
    )

    if (!data || data.length === 0) return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-16 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">No matching records found</p>
        </div>
    )

    return (
        <div className="w-full overflow-x-auto bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50/30 transition-colors">
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-6 py-4 text-sm text-slate-600 font-medium">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
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
