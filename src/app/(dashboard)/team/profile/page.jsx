'use client';
import React from 'react';

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
      <p className="text-slate-500 text-sm font-medium">Manage account credentials and personal details.</p>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <p className="text-slate-500 text-sm">Account profile settings.</p>
      </div>
    </div>
  );
}
