'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiUsers, FiSearch, FiX, FiCheckCircle, FiXCircle,
  FiEdit2, FiShield, FiUserCheck
} from 'react-icons/fi';
import UserRoleModal from '@/component/forms/UserRoleModal';

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

const PeopleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Modal state
  const [roleTarget, setRoleTarget] = useState(null); // user | null
  const [statusLoading, setStatusLoading] = useState(null); // userId | null

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/user/manage');
      if (res.data.success) setUsers(res.data.data);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSuccess = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.user_id === updatedUser.user_id ? { ...u, role: updatedUser.role } : u))
    );
  };

  const toggleStatus = async (user) => {
    setStatusLoading(user.user_id);
    try {
      const res = await axios.patch('/api/user/manage', {
        targetUserId: user.user_id,
        isActive: !user.is_active
      });
      if (res.data.success) {
        toast.success(`User ${!user.is_active ? 'activated' : 'deactivated'}`);
        setUsers((prev) =>
          prev.map((u) => (u.user_id === user.user_id ? { ...u, is_active: !user.is_active } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setStatusLoading(null);
    }
  };

  // Derived values
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const verifiedUsers = users.filter((u) => u.is_verified).length;

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const roles = ['admin', 'manager', 'support', 'developer', 'user'];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
            <FiUsers className="text-violet-600" size={18} />
          </span>
          People Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage platform users, roles and access permissions</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <FiUsers className="text-violet-600" size={20} />, label: 'Total Users', value: totalUsers, bg: 'bg-violet-50' },
          { icon: <FiUserCheck className="text-emerald-600" size={20} />, label: 'Active Users', value: activeUsers, bg: 'bg-emerald-50' },
          { icon: <FiShield className="text-sky-600" size={20} />, label: 'Verified Users', value: verifiedUsers, bg: 'bg-sky-50' },
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
              placeholder="Search name or email..."
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
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white outline-none focus:ring-2 focus:ring-violet-500 transition-all"
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
                <th className="px-6 py-4">User</th>
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
                      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                      <span className="text-sm">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <FiUsers size={32} className="text-slate-200" />
                      <span className="text-sm">No users found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.user_id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          {u.name}
                          {u.is_verified && <FiShield size={14} className="text-sky-500" title="Verified" />}
                        </div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                        u.role === 'admin' ? 'bg-rose-50 text-rose-600' :
                        u.role === 'manager' ? 'bg-amber-50 text-amber-600' :
                        u.role === 'developer' ? 'bg-violet-50 text-violet-600' :
                        u.role === 'support' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600">
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
                      {fmtDate(u.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setRoleTarget(u)}
                          title="Change Role"
                          className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={statusLoading === u.user_id}
                          title={u.is_active ? 'Deactivate' : 'Activate'}
                          className={`p-2 rounded-lg transition-all ${
                            u.is_active
                              ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                              : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                          }`}
                        >
                          {statusLoading === u.user_id ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          ) : u.is_active ? (
                            <FiXCircle size={15} />
                          ) : (
                            <FiCheckCircle size={15} />
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

      {/* Modals */}
      <UserRoleModal
        isOpen={!!roleTarget}
        user={roleTarget}
        onClose={() => setRoleTarget(null)}
        onSuccess={handleRoleSuccess}
      />
    </div>
  );
};

export default PeopleManagement;
