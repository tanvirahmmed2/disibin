'use client';
import { Toaster } from 'react-hot-toast';
import { FiUser, FiSettings } from 'react-icons/fi';
import ProfileForm from '@/component/forms/ProfileForm';

const UserSettingsPage = () => (
  <div className="p-6 max-w-5xl mx-auto space-y-6">
    <Toaster position="top-center" />
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        <FiSettings size={22} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-900">Profile & Address Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Update your personal contact details and billing address.</p>
      </div>
    </div>
    <ProfileForm />
  </div>
);

export default UserSettingsPage;
