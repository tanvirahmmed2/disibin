'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiArrowLeft,
  FiUserPlus,
} from 'react-icons/fi';

const ROLES = [
  {
    value: 'support',
    label: 'Support',
    description: 'Handles support inbox, tickets, and customer queries.',
    color: 'border-primary/20 bg-primary/10 text-primary',
    active: 'border-emerald-500 bg-primary/100 text-white shadow-emerald-200 shadow-md',
  },
  {
    value: 'developer',
    label: 'Developer',
    description: 'Works on projects, board tasks, and technical deliverables.',
    color: 'border-primary/20 bg-primary/10 text-violet-700',
    active: 'border-violet-500 bg-primary/100 text-white shadow-violet-200 shadow-md',
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Full access to manage team, leads, products, and operations.',
    color: 'border-secondary/20 bg-secondary/10 text-secondary',
    active: 'border-amber-500 bg-secondary/100 text-white shadow-amber-200 shadow-md',
  },
];

const inputCls = 'input-style';
const labelCls = 'text-xs font-bold uppercase tracking-wider text-slate-500';

const NewTeamMemberForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, role } = form;

    if (!name.trim()) return toast.error('Full name is required');
    if (!email.trim()) return toast.error('Email address is required');
    if (!role) return toast.error('Please select a role');

    setLoading(true);
    try {
      const res = await axios.post('/api/team/new', { name, email, phone: phone || undefined, role });
      if (res.data.success) {
        toast.success('Team member created! Invitation email sent.');
        setForm({ name: '', email: '', phone: '', role: '' });
        setTimeout(() => router.push('/team/team-member'), 1200);
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/50 p-6">
      <Toaster position="top-center" />

      <div className="w-full">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <FiArrowLeft size={15} />
          Back to Team Members
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0">
              <FiUserPlus className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Add Team Member</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                An invitation email with login credentials will be sent automatically.
              </p>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls} htmlFor="tm-name">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FiUser
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    id="tm-name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                    className={`${inputCls} pl-10`}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls} htmlFor="tm-email">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                  <input
                    id="tm-email"
                    name="email"
                    type="email"
                    placeholder="jane@disibin.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputCls} pl-10`}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className={labelCls} htmlFor="tm-phone">
                Phone Number <span className="text-slate-400 font-normal normal-case">(optional)</span>
              </label>
              <div className="relative">
                <FiPhone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={15}
                />
                <input
                  id="tm-phone"
                  name="phone"
                  type="tel"
                  placeholder="+880 1XXX XXX XXX"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputCls} pl-10`}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Role Picker */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <FiShield size={14} className="text-slate-400" />
                <label className={labelCls}>
                  Role <span className="text-red-400">*</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, role: r.value }))}
                    className={`flex flex-col items-start gap-1 px-4 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.role === r.value ? r.active : `${r.color} hover:opacity-80`
                    }`}
                  >
                    <span className="font-bold text-sm capitalize">{r.label}</span>
                    <span
                      className={`text-xs leading-snug ${
                        form.role === r.value ? 'text-white/80' : 'opacity-70'
                      }`}
                    >
                      {r.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <FiMail className="text-primary mt-0.5 flex-shrink-0" size={15} />
              <p className="text-xs text-primary-dark leading-relaxed">
                A temporary password will be generated and sent to the member's email along with a
                verification link. They should change their password after first login.
              </p>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                id="create-team-member-btn"
                type="submit"
                disabled={loading || !form.role}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiUserPlus size={15} />
                    Create Member
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTeamMemberForm;
