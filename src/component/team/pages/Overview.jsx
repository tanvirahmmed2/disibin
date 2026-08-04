'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FiPieChart, FiActivity, FiUser, FiShield, 
  FiBriefcase, FiBox, FiStar, FiLifeBuoy, 
  FiInbox, FiMessageSquare, FiCheckSquare
} from 'react-icons/fi';
import { FaHandshake } from 'react-icons/fa';

const Overview = ({ userData }) => {
  const role = userData?.role || '';

  // ── Canonical link map ── keep in sync with DashboardSidebar.jsx ──
  const links = {
    admin: [
      { name: 'Analytics',      href: '/dashboard/admin/analytics', icon: <FiPieChart   className="w-8 h-8 text-sky-500"     />, desc: 'View global platform statistics' },
      { name: 'Activity Logs',  href: '/dashboard/admin/activity',  icon: <FiActivity   className="w-8 h-8 text-indigo-500"  />, desc: 'Monitor system events and user actions' },
      { name: 'People',         href: '/dashboard/admin/people',    icon: <FiUser       className="w-8 h-8 text-emerald-500" />, desc: 'Manage registered users' },
      { name: 'Team',           href: '/dashboard/admin/team',      icon: <FiShield     className="w-8 h-8 text-amber-500"   />, desc: 'Manage internal staff and roles' },
      { name: 'Careers',        href: '/dashboard/admin/career',    icon: <FiBriefcase  className="w-8 h-8 text-rose-500"    />, desc: 'Review job applications' },
    ],
    manager: [
      { name: 'Analytics',      href: '/dashboard/manager/analytics', icon: <FiPieChart   className="w-8 h-8 text-sky-500"     />, desc: 'View operational metrics' },
      { name: 'Projects',       href: '/dashboard/manager/projects',  icon: <FiBriefcase  className="w-8 h-8 text-emerald-500" />, desc: 'Manage internal projects' },
      { name: 'Products',       href: '/dashboard/manager/products',  icon: <FiBox        className="w-8 h-8 text-orange-500"  />, desc: 'Manage digital products' },
      { name: 'Reviews',        href: '/dashboard/manager/reviews',   icon: <FiStar       className="w-8 h-8 text-amber-400"   />, desc: 'Moderate customer feedback' },
      { name: 'Tickets',        href: '/dashboard/manager/tickets',   icon: <FiLifeBuoy   className="w-8 h-8 text-indigo-500"  />, desc: 'Handle support tickets' },
      { name: 'Partners',       href: '/dashboard/manager/partners',  icon: <FaHandshake  className="w-8 h-8 text-blue-500"    />, desc: 'Manage homepage partner logos' },
      { name: 'Activity',       href: '/dashboard/manager/activity',  icon: <FiActivity   className="w-8 h-8 text-violet-500"  />, desc: 'Monitor recent platform actions' },
    ],
    support: [
      { name: 'Support Inbox',  href: '/dashboard/support/support',  icon: <FiInbox      className="w-8 h-8 text-sky-500"     />, desc: 'Manage incoming contact forms' },
      { name: 'Tickets',        href: '/dashboard/support/tickets',   icon: <FiLifeBuoy   className="w-8 h-8 text-indigo-500"  />, desc: 'Handle customer support tickets' },
    ],
    developer: [
      { name: 'My Projects',    href: '/dashboard/developer/projects', icon: <FiBriefcase  className="w-8 h-8 text-blue-500"    />, desc: 'View assigned projects' },
      { name: 'My Tasks',       href: '/dashboard/developer/tasks',    icon: <FiCheckSquare className="w-8 h-8 text-emerald-500" />, desc: 'Manage your task assignments' },
    ],
  };

  const roleLinks = links[role] || [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-8 text-white mb-10 shadow-lg shadow-sky-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <p className="text-sky-100 font-medium tracking-wide uppercase text-sm mb-2">
            Welcome back, {role}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {userData?.name || 'Staff Member'}
          </h1>
          <p className="text-sky-50 max-w-xl opacity-90">
            Access your personalized management tools, monitor activity, and handle operational tasks from your overview dashboard.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Quick Access</h2>
        <span className="text-xs text-slate-400 font-medium">{roleLinks.length + 1} tools available</span>
      </div>

      {/* Grid of role links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {roleLinks.map((link, idx) => (
          <Link href={link.href} key={idx} className="group block">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-100 transition-all duration-300 h-full flex flex-col items-start hover:-translate-y-1">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-sky-50 transition-colors mb-4">
                {link.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">
                {link.name}
              </h3>
              <p className="text-sm text-slate-500">{link.desc}</p>
            </div>
          </Link>
        ))}

        {/* Chat — available to everyone */}
        <Link href="/dashboard/chat" className="group block">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-100 transition-all duration-300 h-full flex flex-col items-start hover:-translate-y-1">
            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-sky-50 transition-colors mb-4">
              <FiMessageSquare className="w-8 h-8 text-slate-600 group-hover:text-sky-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">
              Internal Chat
            </h3>
            <p className="text-sm text-slate-500">Communicate with other staff members</p>
          </div>
        </Link>
      </div>

      {roleLinks.length === 0 && (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 mt-4">
          <p className="text-slate-500">No tools are assigned to your role yet.</p>
        </div>
      )}
    </div>
  );
};

export default Overview;
