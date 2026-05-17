'use client';
import { Suspense } from 'react';
import ResetPasswordForm from '@/component/forms/ResetPasswordForm';

// ResetPasswordForm uses useSearchParams() which requires Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
