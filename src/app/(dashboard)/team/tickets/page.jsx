'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  FiLifeBuoy, FiSearch, FiUser,
  FiLoader, FiX, FiRefreshCw
} from 'react-icons/fi';

export default function TeamTicketsListPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/ticket');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      t.title?.toLowerCase().includes(term) ||
      t.user_name?.toLowerCase().includes(term) ||
      t.user_email?.toLowerCase().includes(term) ||
      t.last_message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-xs text-slate-500">Manage customer support tickets</p>
        </div>

        <button
          onClick={fetchTickets}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={14} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          type="text"
          placeholder="Search ticket title, customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FiLoader className="animate-spin mx-auto text-primary" size={24} />
            <p className="text-xs">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-12 text-center space-y-2 px-4">
            <FiLifeBuoy className="mx-auto text-slate-300" size={28} />
            <p className="font-semibold text-slate-700 text-sm">No tickets found</p>
            <p className="text-xs text-slate-500">
              {search ? 'No tickets match your search.' : 'No customer tickets available.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => router.push(`/team/tickets/${t.id}`)}
                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-4"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-400">#{t.id}</span>
                    <h3 className="text-sm font-bold text-slate-800 hover:text-primary truncate">
                      {t.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{t.user_name || 'Customer'}</span>
                    {t.user_email && <span>({t.user_email})</span>}
                  </p>

                  <p className="text-xs text-slate-400 truncate">
                    {t.last_message || 'No messages yet'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">
                    {new Date(t.updated_at || t.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-semibold text-primary hover:underline inline-block mt-0.5">
                    Open Ticket →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
