'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../../helper/Context'
import { usePathname } from 'next/navigation'
import {
  FiActivity,
  FiPieChart,
  FiBriefcase,
  FiLifeBuoy,
  FiUser,
  FiStar,
  FiShield,
  FiInbox,
  FiBox,
  FiUsers,
  FiCreditCard,
  FiFileText,
  FiLogOut,
  FiMessageSquare,
  FiClipboard,
  FiBookOpen,
  FiLayout,
  FiMail,
  FiUserCheck,
  FiAlertCircle,
  FiSettings,
  FiTag,
  FiHelpCircle,
} from 'react-icons/fi'
import { FaGlobeAsia, FaHandshake } from 'react-icons/fa'

const roleLinks = {
  manager: [
    {
      label: 'Overview',
      links: [
        { name: 'Dashboard',     href: '/team',                       icon: <FiPieChart /> },
        { name: 'Activity Log',  href: '/team/activity-log',          icon: <FiActivity /> },
      ],
    },
    {
      label: 'People & Staff',
      links: [
        { name: 'Team Members',  href: '/team/team-member',           icon: <FiShield /> },
        { name: 'Users',         href: '/team/users',                 icon: <FiUsers /> },
        { name: 'Client Leads',  href: '/team/leads/clients',         icon: <FiUserCheck /> },
        { name: 'Business Leads',href: '/team/leads/business',        icon: <FiUserCheck /> },
        { name: 'Careers',       href: '/team/career',                icon: <FiBriefcase /> },
        { name: 'Job Applications', href: '/team/career/applications', icon: <FiBriefcase /> },
      ],
    },
    {
      label: 'Operations & Work',
      links: [
        { name: 'Projects',      href: '/team/projects',              icon: <FiClipboard /> },
        { name: 'Products',      href: '/team/products',              icon: <FiBox /> },
        { name: 'Features',      href: '/team/products/features',     icon: <FiTag /> },
        { name: 'Board',         href: '/team/board',                 icon: <FiLayout /> },
        { name: 'Partners',      href: '/team/partners',              icon: <FaHandshake /> },
        { name: 'Payments',      href: '/team/payments',              icon: <FiCreditCard /> },
        { name: 'Reports',       href: '/team/reports',               icon: <FiFileText /> },
        { name: 'Agreements',    href: '/team/agreements',            icon: <FiBookOpen /> },
        { name: 'Privacy Policy', href: '/team/privacy-policy',        icon: <FiFileText /> },
        { name: 'Terms of Service', href: '/team/terms-of-service',    icon: <FiFileText /> },
        { name: 'Refund Policy', href: '/team/refund-policy',          icon: <FiFileText /> },
        { name: 'FAQs',          href: '/team/faqs',                  icon: <FiHelpCircle /> },
      ],
    },
    {
      label: 'Support & Comms',
      links: [
        { name: 'Support Inbox', href: '/team/support',               icon: <FiAlertCircle /> },
        { name: 'Tickets',       href: '/team/tickets',               icon: <FiLifeBuoy /> },
        { name: 'Reviews',       href: '/team/reviews',               icon: <FiStar /> },
        { name: 'Newsletter',    href: '/team/news-letter',           icon: <FiMail /> },
        { name: 'Team Chat',     href: '/team/chat',                  icon: <FiMessageSquare /> },
      ],
    },
    {
      label: 'Logs & Audit',
      links: [
        { name: 'Team Login Logs', href: '/team/team-login-logs',     icon: <FiInbox /> },
        { name: 'User Login Logs', href: '/team/user-login-logs',     icon: <FiInbox /> },
      ],
    },
  ],
  support: [
    {
      label: 'Overview',
      links: [
        { name: 'Dashboard',     href: '/team',                       icon: <FiPieChart /> },
        { name: 'Activity Log',  href: '/team/activity-log',          icon: <FiActivity /> },
      ],
    },
    {
      label: 'Support & Help',
      links: [
        { name: 'Registered Users', href: '/team/users',              icon: <FiUsers /> },
        { name: 'Client Leads',  href: '/team/leads/clients',         icon: <FiUserCheck /> },
        { name: 'Business Leads',href: '/team/leads/business',        icon: <FiUserCheck /> },
        { name: 'Support Inbox', href: '/team/support',               icon: <FiAlertCircle /> },
        { name: 'Tickets',       href: '/team/tickets',               icon: <FiLifeBuoy /> },
        { name: 'Reviews',       href: '/team/reviews',               icon: <FiStar /> },
        { name: 'Team Chat',     href: '/team/chat',                  icon: <FiMessageSquare /> },
      ],
    },
    {
      label: 'Logs & Audit',
      links: [
        { name: 'Team Login Logs', href: '/team/team-login-logs',     icon: <FiInbox /> },
        { name: 'User Login Logs', href: '/team/user-login-logs',     icon: <FiInbox /> },
      ],
    },
  ],
  developer: [
    {
      label: 'Overview',
      links: [
        { name: 'Dashboard',     href: '/team',                       icon: <FiPieChart /> },
        { name: 'Activity Log',  href: '/team/activity-log',          icon: <FiActivity /> },
      ],
    },
    {
      label: 'Development',
      links: [
        { name: 'Projects',      href: '/team/projects',              icon: <FiClipboard /> },
        { name: 'Board',         href: '/team/board',                 icon: <FiLayout /> },
        { name: 'Reports',       href: '/team/reports',               icon: <FiFileText /> },
        { name: 'Team Chat',     href: '/team/chat',                  icon: <FiMessageSquare /> },
      ],
    },
    {
      label: 'Logs & Audit',
      links: [
        { name: 'Team Login Logs', href: '/team/team-login-logs',     icon: <FiInbox /> },
        { name: 'User Login Logs', href: '/team/user-login-logs',     icon: <FiInbox /> },
      ],
    },
  ],
}

const Sidebar = () => {
  const { dashboardSidebar, setDashboardSidebar, teamData, teamLogout } = useContext(Context)
  const pathname = usePathname()

  const role = teamData?.role || 'manager'
  const sections = roleLinks[role] || roleLinks.manager

  const isActive = (href) => {
    if (href === '/team') return pathname === '/team'
    if (href === '/team/products') return pathname === '/team/products' || (pathname.startsWith('/team/products/') && !pathname.startsWith('/team/products/features'))
    if (href === '/team/career') return pathname === '/team/career' || (pathname.startsWith('/team/career/') && !pathname.startsWith('/team/career/applications'))
    if (href === '/team/leads/clients') return pathname === '/team/leads/clients' || pathname.startsWith('/team/leads/clients/')
    if (href === '/team/leads/business') return pathname === '/team/leads/business' || pathname.startsWith('/team/leads/business/')
    return pathname === href || pathname.startsWith(href + '/')
  }
  const closeMenu = () => setDashboardSidebar(false)

  return (
    <>
      {/* Mobile overlay */}
      {dashboardSidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          dashboardSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {section.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary font-bold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-base shrink-0">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Account Settings
            </p>
            <div className="flex flex-col gap-0.5">
              <Link
                href="/team/profile"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive('/team/profile')
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FiUser className="text-base shrink-0" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/team/settings"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive('/team/settings')
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FiSettings className="text-base shrink-0" />
                <span>Settings</span>
              </Link>
              <Link
                href="/team/security"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive('/team/security')
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FiShield className="text-base shrink-0" />
                <span>Security</span>
              </Link>
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
              >
                <FaGlobeAsia className="text-base shrink-0" />
                <span>Web Home</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-slate-100 space-y-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">{teamData?.name || 'Staff Member'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
              {teamData?.role || 'Team'}
            </p>
          </div>
          <button
            onClick={teamLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all duration-200"
          >
            <FiLogOut className="text-base shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
