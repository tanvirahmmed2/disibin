'use client';
import React from 'react';

export default function AgreementsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Agreements</h1>
      <p className="text-slate-500 text-sm font-medium">Manage legal agreements and contract documentation.</p>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <p className="text-slate-500 text-sm">No agreements uploaded yet.</p>
      </div>
    </div>
  );
}
