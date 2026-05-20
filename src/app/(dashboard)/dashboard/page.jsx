import React from 'react';
import { ManagementRole } from '@/lib/middleware';
import DashboardOverview from '@/component/dashboard/DashboardOverview';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const auth = await ManagementRole();

  if (!auth.success) {
    return redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardOverview userData={auth.data} />
    </div>
  );
};

export default DashboardPage;
