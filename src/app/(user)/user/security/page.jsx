'use client';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Context } from '@/component/helper/Context';
import { Toaster, toast } from 'react-hot-toast';
import {
  FiShield, FiLock, FiMail, FiCheckCircle,
  FiTrash2, FiAlertTriangle, FiSend, FiKey, FiSmartphone
} from 'react-icons/fi';

export default function UserSecurityPage() {
  const router = useRouter();
  const { userData, setUserData, logout } = useContext(Context);

  // 2FA State
  const [is2faActive, setIs2faActive] = useState(false);
  const [tfaLoading, setTfaLoading] = useState(false);

  // Password state
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  // Email change state
  const [emailForm, setEmailForm] = useState({ newEmail: '', code: '' });
  const [emailStep, setEmailStep] = useState('request'); // 'request' | 'verify'
  const [emailLoading, setEmailLoading] = useState(false);
  const [pendingTargetEmail, setPendingTargetEmail] = useState('');

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (userData) {
      setIs2faActive(!!userData.is_2fa_active);
    }
  }, [userData]);

  // Handle 2FA Toggle
  const handleToggle2fa = async (newValue) => {
    setTfaLoading(true);
    try {
      const res = await axios.post('/api/user/security', {
        action: 'toggle-2fa',
        is2faActive: newValue,
      });

      if (res.data.success) {
        setIs2faActive(newValue);
        setUserData((prev) => ({ ...prev, is_2fa_active: newValue }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update 2FA state');
    } finally {
      setTfaLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (pwdForm.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }

    setPwdLoading(true);
    try {
      const res = await axios.post('/api/user/security', {
        action: 'change-password',
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });

      if (res.data.success) {
        toast.success('Password updated successfully!');
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  // Step 1: Request email change (code sent to current old email)
  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    if (!emailForm.newEmail) return toast.error('Please enter a new email address');

    setEmailLoading(true);
    try {
      const res = await axios.post('/api/user/security', {
        action: 'request-email-change',
        newEmail: emailForm.newEmail,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setPendingTargetEmail(emailForm.newEmail);
        setEmailStep('verify');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request email change');
    } finally {
      setEmailLoading(false);
    }
  };

  // Step 2: Verify email change code
  const handleVerifyEmailCode = async (e) => {
    e.preventDefault();
    if (!emailForm.code) return toast.error('Please enter the verification code');

    setEmailLoading(true);
    try {
      const res = await axios.post('/api/user/security', {
        action: 'verify-email-change',
        code: emailForm.code,
      });

      if (res.data.success) {
        toast.success('Email updated successfully!');
        setUserData((prev) => ({ ...prev, email: res.data.newEmail, pending_email: null }));
        setEmailForm({ newEmail: '', code: '' });
        setEmailStep('request');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify email code');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) return toast.error('Password is required');

    setDeleteLoading(true);
    try {
      const res = await axios.delete('/api/user', { data: { password: deletePassword } });
      if (res.data.success) {
        toast.success('Account deleted successfully');
        setShowDeleteModal(false);
        setUserData(null);
        window.location.replace('/auth/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const inputCls = 'input-style';
  const labelCls = 'text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <FiShield size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Security & Credentials</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage two-factor authentication, password, email address verification, and account deletion.
          </p>
        </div>
      </div>

      {/* 2FA Toggle Card */}
      <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              is2faActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <FiSmartphone size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  is2faActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {is2faActive ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Add an extra layer of security to your account. When enabled, login attempts require two-factor verification.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleToggle2fa(!is2faActive)}
          disabled={tfaLoading}
          className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            is2faActive ? 'bg-emerald-500' : 'bg-slate-300'
          } ${tfaLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              is2faActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Password Update Card */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FiLock size={16} />
            </span>
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className={labelCls}>Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pwdForm.currentPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={pwdForm.newPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={pwdForm.confirmPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
            >
              {pwdLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Email Address Update Card */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FiMail size={16} />
            </span>
            Update Email Address
          </h2>

          <div className="p-3.5 rounded-2xl bg-primary/10/70 border border-primary/20 text-xs text-primary-dark leading-relaxed">
            <strong>Security Notice:</strong> When you update your email, a 6-digit verification code will be sent to your{' '}
            <strong>current registered email ({userData?.email})</strong> to confirm ownership before applying the change.
          </div>

          {emailStep === 'request' ? (
            <form onSubmit={handleRequestEmailChange} className="space-y-4">
              <div>
                <label className={labelCls}>Current Email</label>
                <input
                  type="email"
                  value={userData?.email || ''}
                  disabled
                  className={`${inputCls} opacity-60 bg-slate-100 cursor-not-allowed`}
                />
              </div>

              <div>
                <label className={labelCls}>New Email Address</label>
                <input
                  type="email"
                  placeholder="newemail@example.com"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className={inputCls}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary transition-all shadow-md shadow-primary/20 disabled:opacity-50"
              >
                <FiSend size={15} />
                {emailLoading ? 'Sending Verification Code...' : 'Send Verification Code to Current Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmailCode} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
                Code sent to: <strong>{userData?.email}</strong>. Enter code below to confirm change to{' '}
                <strong>{pendingTargetEmail}</strong>.
              </div>

              <div>
                <label className={labelCls}>6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={emailForm.code}
                  onChange={(e) => setEmailForm({ ...emailForm, code: e.target.value })}
                  className={`${inputCls} text-center tracking-[0.4em] font-mono text-lg font-bold`}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEmailStep('request')}
                  className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-2/3 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  <FiCheckCircle size={15} />
                  {emailLoading ? 'Verifying Code...' : 'Confirm & Update Email'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="md:col-span-2 bg-rose-50/50 rounded-3xl p-7 border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900">Danger Zone — Delete Account</h3>
                <p className="text-xs text-rose-600 mt-0.5">Permanently delete your profile and account credentials.</p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20"
            >
              <FiTrash2 size={14} /> Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 border border-slate-100 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <FiTrash2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              This action is permanent and cannot be undone. Please enter your password to confirm deletion of your account.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className={labelCls}>Enter Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="w-1/2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
