'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle, FiFolder, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/user/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id = null) => {
    try {
      const res = await axios.patch('/api/user/notifications', {
        notification_id: id,
        mark_all: id === null,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setNotifications((prev) =>
          prev.map((item) => (id === null || item.id === id ? { ...item, is_read: true } : item))
        );
        fetchNotifications();
      }
    } catch {
      toast.error('Failed to update notification status');
    }
  };

  const unreadCount = notifications.filter((n) => !Boolean(n.is_read)).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !Boolean(n.is_read);
    if (filter === 'system') return n.type === 'system' || n.type === 'info' || n.type === 'review';
    if (filter === 'projects') return n.type === 'project' || n.type === 'ticket';
    return true;
  });

  return (
    <div className="p-4 w-full space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FiBell className="text-primary" /> Notifications
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-xs font-extrabold shadow-sm">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Stay updated with your latest project activity, system notices, and ticket replies
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => handleMarkAsRead(null)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20"
          >
            <FiCheckCircle size={14} /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto">
        {[
          { key: 'all', label: 'All Updates' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'projects', label: 'Projects & Tickets' },
          { key: 'system', label: 'System Announcements' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filter === tab.key
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3"></div>
          <p className="text-slate-500 text-sm font-medium">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <FiBell size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Notifications</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            You are all caught up! There are no notifications in this view.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !n.is_read
                  ? 'bg-primary/5 border-primary/20 shadow-sm'
                  : 'bg-white border-slate-100 text-slate-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl mt-0.5 ${
                    n.type === 'project'
                      ? 'bg-emerald-50 text-emerald-600'
                      : n.type === 'ticket'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {n.type === 'project' ? (
                    <FiFolder size={18} />
                  ) : n.type === 'ticket' ? (
                    <FiAlertCircle size={18} />
                  ) : (
                    <FiInfo size={18} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-slate-400 font-medium inline-block mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {n.link && (
                  <Link
                    href={n.link}
                    onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 text-xs font-bold transition-all"
                  >
                    <FiExternalLink size={14} />
                  </Link>
                )}
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}