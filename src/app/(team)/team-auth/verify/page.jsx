'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage('No verification token found in URL.');
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await axios.post('/api/team/security', { token });
        if (res.data.success) {
          setSuccess(true);
          setMessage(res.data.message || 'Account verified successfully!');
        } else {
          setSuccess(false);
          setMessage(res.data.message || 'Verification failed.');
        }
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Invalid or expired verification token.');
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
      <div className="w-full max-w-md bg-white flex flex-col items-center justify-center gap-6 p-8 rounded-2xl shadow-xl border border-slate-100">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            <h2 className="text-xl font-bold text-slate-800">Verifying Your Account...</h2>
            <p className="text-sm text-slate-500">Please wait while we confirm your email address.</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
            <p className="text-sm text-slate-600 font-medium">{message}</p>
            <Link
              href="/team-auth/login"
              className="w-full py-3 text-center rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/10 mt-2"
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl font-bold">
              ✕
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
            <p className="text-sm text-slate-600 font-medium">{message}</p>
            <p className="text-xs text-slate-400">
              If you believe this is an error, please contact your manager.
            </p>
            <Link
              href="/team-auth/login"
              className="w-full py-3 text-center rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/10 mt-2"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamVerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-medium">Loading...</p>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
