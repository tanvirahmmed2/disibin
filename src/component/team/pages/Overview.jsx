'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiPieChart, FiActivity, FiUser, FiShield,
  FiBriefcase, FiBox, FiStar, FiLifeBuoy,
  FiInbox, FiMessageSquare, FiClipboard, FiLayout,
  FiUserCheck, FiFileText, FiArrowRight
} from 'react-icons/fi';
import { FaHandshake } from 'react-icons/fa';

const Overview = ({ teamData }) => {
  const role = teamData?.role || 'manager';

  const roleLinks = {
    manager: [
      { name: 'Projects', href: '/team/projects', icon: <FiClipboard className="w-6 h-6 text-primary" />, desc: 'Manage internal projects & deliverables' },
      { name: 'Products', href: '/team/products', icon: <FiBox className="w-6 h-6 text-secondary" />, desc: 'Manage product catalog and features' },
      { name: 'Client Leads', href: '/team/leads/clients', icon: <FiUserCheck className="w-6 h-6 text-primary" />, desc: 'Track and convert client inquiries' },
      { name: 'Business Leads', href: '/team/leads/business', icon: <FiBriefcase className="w-6 h-6 text-secondary" />, desc: 'B2B opportunity management' },
      { name: 'Kanban Board', href: '/team/board', icon: <FiLayout className="w-6 h-6 text-primary" />, desc: 'Organize team tasks and workflows' },
      { name: 'Issue Reports', href: '/team/reports', icon: <FiFileText className="w-6 h-6 text-rose-500" />, desc: 'Review submitted technical bug reports' },
      { name: 'Support Inbox', href: '/team/support', icon: <FiLifeBuoy className="w-6 h-6 text-primary" />, desc: 'Manage customer inquiries and support' },
      { name: 'User Management', href: '/team/users', icon: <FiUser className="w-6 h-6 text-primary" />, desc: 'Manage registered user accounts' },
      { name: 'Activity Log', href: '/team/activity-log', icon: <FiActivity className="w-6 h-6 text-primary" />, desc: 'Monitor system events and actions' },
    ],
    support: [
      { name: 'Support Inbox', href: '/team/support', icon: <FiLifeBuoy className="w-6 h-6 text-primary" />, desc: 'Manage customer inquiries and support' },
      { name: 'Tickets', href: '/team/tickets', icon: <FiInbox className="w-6 h-6 text-primary" />, desc: 'Track open customer tickets' },
      { name: 'Client Leads', href: '/team/leads/clients', icon: <FiUserCheck className="w-6 h-6 text-primary" />, desc: 'View client inquiries' },
      { name: 'User Reviews', href: '/team/reviews', icon: <FiStar className="w-6 h-6 text-amber-400" />, desc: 'Moderate platform feedback' },
      { name: 'Team Chat', href: '/team/chat', icon: <FiMessageSquare className="w-6 h-6 text-primary" />, desc: 'Communicate with team members' },
    ],
    developer: [
      { name: 'Projects', href: '/team/projects', icon: <FiClipboard className="w-6 h-6 text-primary" />, desc: 'View assigned project builds' },
      { name: 'Kanban Board', href: '/team/board', icon: <FiLayout className="w-6 h-6 text-primary" />, desc: 'Track developer tasks' },
      { name: 'Issue Reports', href: '/team/reports', icon: <FiFileText className="w-6 h-6 text-rose-500" />, desc: 'Investigate technical reports' },
      { name: 'Team Chat', href: '/team/chat', icon: <FiMessageSquare className="w-6 h-6 text-blue-500" />, desc: 'Internal staff discussions' },
    ],
  };

  const currentLinks = roleLinks[role] || roleLinks.manager;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-light text-xs font-bold uppercase tracking-wider">
            <FiShield size={12} />
            <span>Role: {role}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, {teamData?.name || 'Staff Member'}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Access your management tools, monitor operational metrics, review client leads, and handle support requests from your team overview workspace.
          </p>
        </div>
      </div>

      {/* Quick Access Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Operational Tools & Workspaces</h2>
          <p className="text-xs text-slate-500 mt-0.5">{currentLinks.length} management modules available for your role</p>
        </div>
      </div>

      {/* Grid of Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentLinks.map((link, idx) => (
          <Link href={link.href} key={idx} className="group block">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/10 transition-colors w-fit mb-4">
                  {link.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {link.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{link.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-primary mt-5 pt-3 border-t border-slate-50 group-hover:translate-x-1 transition-transform">
                <span>Open Workspace</span>
                <FiArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}

        {/* Team Chat Link */}
        <Link href="/team/chat" className="group block">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-primary/10 transition-colors w-fit mb-4">
                <FiMessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                Team Chat
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">Communicate and collaborate with other team members</p>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-primary mt-5 pt-3 border-t border-slate-50 group-hover:translate-x-1 transition-transform">
              <span>Open Chat</span>
              <FiArrowRight size={14} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Overview;
