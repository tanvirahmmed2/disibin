'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiX, FiShield } from 'react-icons/fi';

const UserRoleModal = ({ isOpen, user, onClose, onSuccess }) => {
  const [role, setRole] = useState('support');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.role || 'support');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch('/api/user/manage', {
        targetUserId: user.id || user.user_id,
        role
      });
      if (res.data.success) {
        toast.success(res.data.message || 'User role updated successfully');
        onSuccess(res.data.data || { ...user, role });
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <FiX size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FiShield size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Change Member Role</h3>
            <p className="text-xs text-slate-500">{user.name} ({user.email})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-style cursor-pointer font-medium"
            >
              <option value="support">Support</option>
              <option value="manager">Manager</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-primary transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRoleModal;
