'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiUser, FiPlus, FiEdit2, FiTrash2, FiSearch, FiX,
  FiMail, FiBriefcase
} from 'react-icons/fi';
import TeamModal from '@/component/forms/TeamModal';
import DeleteTeamModal from '@/component/forms/DeleteTeamModal';

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // member | null
  const [deleteTarget, setDeleteTarget] = useState(null); // member | null
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/team');
      if (res.data.success) setMembers(res.data.data);
    } catch {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newMember) => {
    setMembers((prev) => [...prev, newMember]);
  };

  const handleUpdateSuccess = (updated) => {
    setMembers((prev) =>
      prev.map((m) => (m.member_id === updated.member_id ? updated : m))
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`/api/team?id=${deleteTarget.member_id}`);
      if (res.data.success) {
        setMembers((prev) => prev.filter((m) => m.member_id !== deleteTarget.member_id));
        toast.success('Team member removed');
        setDeleteTarget(null);
      }
    } catch {
      toast.error('Failed to remove team member');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.post.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <FiBriefcase className="text-violet-600" size={18} />
            </span>
            Team Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage public team members and staff</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <FiPlus size={16} /> Add Member
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 max-w-md">
            <FiSearch className="text-slate-400 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 max-w-xs">Bio</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading members...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiUser size={32} className="text-slate-200" />
                      <span className="text-sm">No members found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.member_id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Member */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <div className="font-bold text-slate-900">{m.name}</div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {m.post}
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {m.email ? (
                        <div className="flex items-center gap-1">
                          <FiMail size={12} className="text-slate-400" />
                          {m.email}
                        </div>
                      ) : '—'}
                    </td>

                    {/* Bio */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-slate-500 text-xs truncate" title={m.bio}>{m.bio || '—'}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditTarget(m)}
                          title="Edit Member"
                          className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(m)}
                          title="Remove Member"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TeamModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      <TeamModal
        isOpen={!!editTarget}
        initialData={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={handleUpdateSuccess}
      />

      <DeleteTeamModal
        isOpen={!!deleteTarget}
        member={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default TeamManagement;
