'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiUsers, FiSearch, FiX, FiCheckCircle, FiXCircle,
  FiShield, FiUserPlus, FiTrash2, FiUserCheck, FiBriefcase
} from 'react-icons/fi';

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

const TeamMemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [statusLoading, setStatusLoading] = useState(null); // id | null
  const [deleteLoading, setDeleteLoading] = useState(null); // id | null

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

  const toggleStatus = async (member) => {
    setStatusLoading(member.id);
    try {
      const res = await axios.patch('/api/team', {
        id: member.id,
        is_active: !member.is_active
      });
      if (res.data.success) {
        toast.success(`Member ${!member.is_active ? 'activated' : 'deactivated'}`);
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, is_active: !member.is_active } : m))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(null);
    }
  };

  const updateRole = async (member, newRole) => {
    if (member.role === newRole) return;
    try {
      const res = await axios.patch('/api/team', {
        id: member.id,
        role: newRole
      });
      if (res.data.success) {
        toast.success(`Role updated to ${newRole}`);
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const removeMember = async (member) => {
    if (!confirm(`Are you sure you want to remove ${member.name}?`)) return;

    setDeleteLoading(member.id);
    try {
      const res = await axios.delete(`/api/team?id=${member.id}`);
      if (res.data.success) {
        toast.success('Team member removed');
        setMembers((prev) => prev.filter((m) => m.id !== member.id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Derived values
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.is_active).length;
  const managerCount = members.filter((m) => m.role === 'manager' && m.is_active).length;

  const filtered = members.filter((m) => {
    const matchSearch =
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || m.role === filterRole;
    return matchSearch && matchRole;
  });

  const roles = ['manager', 'support', 'developer'];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <FiShield className="text-white" size={18} />
            </span>
            Team Member Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage team members, roles and active statuses</p>
        </div>

        <Link
          href="/team/team-member/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-all shadow-md shadow-slate-900/10"
        >
          <FiUserPlus size={16} />
          <span>Add Team Member</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <FiUsers className="text-primary" size={20} />, label: 'Total Members', value: totalMembers, bg: 'bg-primary/10' },
          { icon: <FiUserCheck className="text-primary" size={20} />, label: 'Active Members', value: activeMembers, bg: 'bg-primary/10' },
          { icon: <FiBriefcase className="text-secondary" size={20} />, label: 'Active Managers', value: managerCount, bg: 'bg-secondary/10' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
            <FiSearch className="text-slate-400 shrink-0" size={15} />
            <input
              type="text"
              placeholder="Search member by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-style text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                <FiX size={14} />
              </button>
            )}
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-style text-sm py-2"
          >
            <option value="all">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r} className="capitalize">{r}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading team members...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiUsers size={32} className="text-slate-200" />
                      <span className="text-sm">No team members found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Member */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {m.name}
                          {m.is_verified && <FiShield size={14} className="text-primary" title="Verified" />}
                        </div>
                        <div className="text-xs text-slate-400">{m.email}</div>
                        {m.phone && <div className="text-[11px] text-slate-400">{m.phone}</div>}
                      </div>
                    </td>

                    {/* Role selector */}
                    <td className="px-6 py-4">
                      <select
                        value={m.role}
                        onChange={(e) => updateRole(m, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize border outline-none cursor-pointer transition-colors ${
                          m.role === 'manager' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                          m.role === 'developer' ? 'bg-primary/10 text-violet-700 border-primary/20' :
                          'bg-primary/10 text-primary border-primary/20'
                        }`}
                      >
                        {roles.map((r) => (
                          <option key={r} value={r} className="capitalize bg-white text-slate-900">
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {m.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary">
                          <FiCheckCircle size={11} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500">
                          <FiXCircle size={11} /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {fmtDate(m.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleStatus(m)}
                          disabled={statusLoading === m.id}
                          title={m.is_active ? 'Deactivate Member' : 'Activate Member'}
                          className={`p-2 rounded-lg transition-all ${
                            m.is_active
                              ? 'text-slate-400 hover:text-secondary hover:bg-secondary/10'
                              : 'text-slate-400 hover:text-primary hover:bg-primary/10'
                          }`}
                        >
                          {statusLoading === m.id ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          ) : m.is_active ? (
                            <FiXCircle size={16} />
                          ) : (
                            <FiCheckCircle size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => removeMember(m)}
                          disabled={deleteLoading === m.id}
                          title="Remove Team Member"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          {deleteLoading === m.id ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={16} />
                          )}
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
    </div>
  );
};

export default TeamMemberManagement;
