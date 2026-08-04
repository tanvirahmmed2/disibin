'use client';
import React from 'react';

export default function UserLoginLogsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Login Audit Logs</h1>
        <p className="text-slate-500 text-sm font-medium">
          Audit history of user login activity and authentication events.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <p className="text-slate-500 text-sm">No login log records found.</p>
      </div>
    </div>
  );
}
