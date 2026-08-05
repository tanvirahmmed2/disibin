'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  FiLifeBuoy, FiPlus, FiMessageSquare, FiImage,
  FiCalendar, FiLoader, FiSearch, FiX, FiRefreshCw
} from 'react-icons/fi';
import NewTicketModal from '@/component/forms/NewTicketModal';

export default function UserTicketsListPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/user/ticket');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      t.title?.toLowerCase().includes(term) ||
      t.last_message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
              <FiLifeBuoy size={20} />
            </span>
            My Support Tickets
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Track your support inquiries and chat with technical support
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs"
            title="Refresh Tickets"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
          >
            <FiPlus size={16} />
            New Ticket
          </button>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search my tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-sky-500" size={28} />
            <p className="text-sm font-medium">Loading your support tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FiMessageSquare size={32} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-slate-800 text-base">No support tickets</h3>
              <p className="text-xs text-slate-500">
                {search ? 'No tickets match your search query.' : 'You have not created any support tickets yet.'}
              </p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="text-xs text-sky-600 font-bold hover:underline"
            >
              + Create First Ticket
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => router.push(`/user/tickets/${t.id}`)}
                className="p-5 hover:bg-slate-50/80 cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 font-bold">
                    <FiMessageSquare size={22} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                        {t.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{t.id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate font-medium">
                      {t.last_message || 'No messages yet'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-slate-400">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                  <span className="inline-block mt-2 px-4 py-1.5 bg-slate-900 group-hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                    Open Ticket →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={(newTicketData) => {
          fetchTickets();
          if (newTicketData?.ticket?.id) {
            router.push(`/user/tickets/${newTicketData.ticket.id}`);
          }
        }}
      />
    </div>
  );
}
