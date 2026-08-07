'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiUsers, FiSearch, FiMail, FiUserCheck, FiUserX,
  FiMapPin, FiCalendar, FiLoader, FiX, FiRefreshCw, FiArrowRight
} from 'react-icons/fi';

export default function RegisteredUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [quickEmail, setQuickEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch {
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLookup = (e) => {
    e.preventDefault();
    if (!quickEmail.trim()) return toast.error('Please enter an email address');
    router.push(`/team/users/${encodeURIComponent(quickEmail.trim())}`);
  };

  const filteredUsers = users.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FiUsers size={20} />
            </span>
            Registered Platform Accounts
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Lookup user profile details, email records, and account activity history
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs self-start sm:self-auto shadow-sm"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          Refresh Users List
        </button>
      </div>

      {/* Quick Email Lookup Bar */}
      <form onSubmit={handleEmailLookup} className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-md space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-bold flex items-center gap-2">
            <FiMail className="text-primary-light" size={18} />
            Direct Email Profile Lookup
          </h2>
          <p className="text-xs text-slate-300">
            Type any registered user's email address to inspect their full profile, tickets, and reviews
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input
            type="email"
            value={quickEmail}
            onChange={e => setQuickEmail(e.target.value)}
            placeholder="Enter user email address (e.g. client@example.com)..."
            required
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            Lookup Profile <FiArrowRight size={14} />
          </button>
        </div>
      </form>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by email, name, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-style pl-10 pr-9 text-sm py-2"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Showing {filteredUsers.length} of {users.length} registered users
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiUsers className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No registered users found</p>
            <p className="text-xs text-slate-500">There are no user accounts matching your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                          {u.name?.charAt(0) || u.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">User #{u.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a href={`mailto:${u.email}`} className="font-bold text-slate-800 hover:text-primary transition-colors">
                        {u.email}
                      </a>
                      {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        u.is_verified
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-secondary/10 text-secondary border border-secondary/20'
                      }`}>
                        {u.is_verified ? <FiUserCheck size={12} /> : <FiUserX size={12} />}
                        {u.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600">
                      {u.city || u.country ? (
                        <span className="flex items-center gap-1">
                          <FiMapPin className="text-rose-500 shrink-0" size={12} />
                          {[u.city, u.country].filter(Boolean).join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/team/users/${encodeURIComponent(u.email)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-primary text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        View Profile →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
