'use client';
import ProfileForm from '@/component/forms/ProfileForm';

const ProfilePage = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
      <p className="text-slate-500 mt-1">Manage your personal information and preferences.</p>
    </div>
    <ProfileForm />
  </div>
);

export default ProfilePage;
