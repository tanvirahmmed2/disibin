'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiMessageSquare, FiUsers, FiUser, FiPlus, FiX,
  FiSearch, FiLoader, FiCheckCircle, FiRefreshCw
} from 'react-icons/fi';

export default function TeamChatListPage() {
  const router = useRouter();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // New Chat Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);
  const [searchMember, setSearchMember] = useState('');

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/team/chat');
      if (res.data.success) {
        setInbox(res.data.data);
      }
    } catch {
      toast.error('Failed to load team conversations');
    } finally {
      setLoading(false);
    }
  };

  const openNewChatModal = async () => {
    setIsModalOpen(true);
    setSelectedMemberIds([]);
    setGroupTitle('');
    try {
      const res = await axios.get('/api/team/chat/members');
      if (res.data.success) {
        setTeamMembers(res.data.data);
      }
    } catch {
      toast.error('Failed to load team members');
    }
  };

  const toggleMemberSelection = (id) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const createNewChat = async () => {
    if (selectedMemberIds.length === 0) {
      return toast.error('Please select at least one team member');
    }

    const isGroup = selectedMemberIds.length > 1;
    if (isGroup && !groupTitle.trim()) {
      return toast.error('Please enter a group title');
    }

    setCreatingChat(true);
    try {
      const res = await axios.post('/api/team/chat', {
        isGroup,
        title: groupTitle.trim(),
        participantTeamIds: selectedMemberIds
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setIsModalOpen(false);
        if (res.data.data?.id) {
          router.push(`/team/chat/${res.data.data.id}`);
        } else {
          fetchInbox();
        }
      } else {
        toast.error(res.data.message || 'Failed to start conversation');
      }
    } catch {
      toast.error('Failed to start conversation');
    } finally {
      setCreatingChat(false);
    }
  };

  const filteredInbox = inbox.filter(c => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const name = c.is_group ? c.title : c.other_participant_name;
    return name?.toLowerCase().includes(term) || c.last_message?.toLowerCase().includes(term);
  });

  const filteredMembers = teamMembers.filter(m =>
    m.name?.toLowerCase().includes(searchMember.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchMember.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="p-4 w-full space-y-6">
      <Toaster position="top-center" />

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FiMessageSquare size={20} />
            </span>
            Team Messages
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Internal team conversations and group discussions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchInbox}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs"
            title="Refresh Inbox"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          </button>
          <button
            onClick={openNewChatModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
          >
            <FiPlus size={16} />
            New Conversation
          </button>
        </div>
      </div>

      {/* Search & Inbox List Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
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
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading conversations...</p>
          </div>
        ) : filteredInbox.length === 0 ? (
          <div className="py-16 text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FiMessageSquare size={32} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-slate-800 text-base">No conversations found</h3>
              <p className="text-xs text-slate-500">
                {search ? 'No chats match your search query.' : 'Start a new direct message or group chat with team members.'}
              </p>
            </div>
            <button
              onClick={openNewChatModal}
              className="text-xs text-primary font-bold hover:underline"
            >
              + Start a Conversation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredInbox.map((chat) => {
              const displayName = chat.is_group ? chat.title : (chat.other_participant_name || 'Staff Member');
              return (
                <div
                  key={chat.id}
                  onClick={() => router.push(`/team/chat/${chat.id}`)}
                  className="p-5 hover:bg-slate-50/80 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg ${
                      chat.is_group ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                    }`}>
                      {chat.is_group ? <FiUsers size={22} /> : <FiUser size={22} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                          {displayName}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          chat.is_group ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary-dark'
                        }`}>
                          {chat.is_group ? 'Group' : (chat.other_participant_role || 'Staff')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {chat.last_message ? (
                          <>
                            <span className="font-semibold text-slate-700">{chat.last_sender_name}: </span>
                            {chat.last_message}
                          </>
                        ) : 'No messages yet'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {chat.last_message_time && (
                      <p className="text-xs font-medium text-slate-400">
                        {new Date(chat.last_message_time).toLocaleDateString()}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Chat →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FiUsers className="text-primary" size={18} />
                New Team Conversation
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <p className="text-xs text-slate-500">
                Select team members to start a 1-on-1 direct message or create a group chat.
              </p>

              {/* Search Member */}
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search staff members..."
                  value={searchMember}
                  onChange={e => setSearchMember(e.target.value)}
                  className="input-style text-xs py-2"
                />
              </div>

              {/* Member Selection List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {filteredMembers.map((member) => {
                  const isSelected = selectedMemberIds.includes(member.id);
                  return (
                    <div
                      key={member.id}
                      onClick={() => toggleMemberSelection(member.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary-light text-sky-900'
                          : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs shrink-0">
                          {member.name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-800 truncate">{member.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize truncate">{member.role} · {member.email}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-primary border-sky-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <FiCheckCircle size={12} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Group Title Field */}
              {selectedMemberIds.length > 1 && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Group Title *
                  </label>
                  <input
                    type="text"
                    value={groupTitle}
                    onChange={e => setGroupTitle(e.target.value)}
                    placeholder="E.g. Sales Team, Project Alpha..."
                    className="input-style text-xs py-2"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createNewChat}
                disabled={selectedMemberIds.length === 0 || creatingChat}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 shadow-md flex items-center gap-2"
              >
                {creatingChat ? <FiLoader className="animate-spin" size={14} /> : null}
                {creatingChat
                  ? 'Starting...'
                  : selectedMemberIds.length > 1
                  ? 'Create Group Chat'
                  : 'Start Direct Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
