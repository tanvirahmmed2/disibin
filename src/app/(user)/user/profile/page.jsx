import React from 'react'

const ProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
        Your Profile
      </h1>
      <p className="text-slate-500 max-w-md">
        Manage your personal information, security settings, and project preferences.
      </p>
      <div className="mt-12 w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
         <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-400 font-bold text-2xl">
            U
         </div>
         <div className="space-y-4">
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
         </div>
      </div>
    </div>
  )
}

export default ProfilePage
