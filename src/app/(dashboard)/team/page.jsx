import React from 'react';
import DashboardOverview from '@/component/team/pages/Overview';
import { isTeamLogin } from '@/lib/auth/team';

const DashboardPage = async () => {
  const auth = await isTeamLogin();
  const teamData = auth?.success ? auth.data : null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardOverview teamData={teamData} />
    </div>
  );
};

export default DashboardPage;
