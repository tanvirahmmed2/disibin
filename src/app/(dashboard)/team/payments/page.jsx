'use client';
import React from 'react';

export default function PaymentsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments & Invoices</h1>
      <p className="text-slate-500 text-sm font-medium">Track payments, dues, and transaction histories.</p>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <p className="text-slate-500 text-sm">No payment records found.</p>
      </div>
    </div>
  );
}
