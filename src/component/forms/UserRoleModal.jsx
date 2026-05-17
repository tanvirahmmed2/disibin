'use client';
import React, { useState } from 'react';
import { FiUser, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

/**
 * UserRoleModal
 * -------------
 * Modal to change a user's role.
 *
 * Props
 *   isOpen    — boolean
 *   user      — the user object (needs .user_id, .name, .role)
 *   onClose   — () => void
 *   onSuccess — (updatedUser) => void
 */
const UserRoleModal = ({ isOpen, user, onClose, onSuccess }) => {
  const [role, setRole] = useState(user?.role || 'user');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch('/api/user/manage', {
        targetUserId: user.user_id,
        role: role
      });
      if (res.data.success) {
        toast.success('User role updated');
        onSuccess?.(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const roles = ['admin', 'manager', 'support', 'developer', 'user'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-violet-600 to-indigo-600">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiUser size={18} />
            Change Role · {user.name}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-white outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="capitalize">{r}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || role === user.role}
              className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UserRoleModal;
