'use client';
import React from 'react';

export default function ReportsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500 text-sm font-medium">
          View platform statistics, business metrics, and revenue overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
          <h2 className="text-2xl font-bold text-slate-900">$0.00</h2>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Clients</span>
          <h2 className="text-2xl font-bold text-slate-900">0</h2>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Tickets</span>
          <h2 className="text-2xl font-bold text-slate-900">0</h2>
        </div>
      </div>
    </div>
  );
}
