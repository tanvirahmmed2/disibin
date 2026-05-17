'use client';
import { Toaster } from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';
import ProfileForm from '@/component/forms/ProfileForm';

const UserSettingsPage = () => (
  <div className="p-6 max-w-4xl mx-auto space-y-8">
    <Toaster position="top-center" />
    <div>
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        <FiUser className="text-sky-500" /> Account Settings
      </h1>
      <p className="text-slate-500 text-sm mt-1">Manage your personal information and billing address.</p>
    </div>
    <ProfileForm />
  </div>
);

export default UserSettingsPage;
