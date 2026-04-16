'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Verifying your email...');

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setStatus('error');
            setMessage('Invalid verification link. Please check your email and try again.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await axios.get(`/api/user/verify-email?token=${token}&email=${email}`);
                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message || 'Email verified successfully!');
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Verification failed.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred during verification.');
            }
        };

        verifyEmail();
    }, [token, email]);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full card-premium p-12 text-center"
            >
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                            <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{message}</h1>
                        <p className="text-slate-500 font-medium whitespace-pre-wrap">Please wait while we secure your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl font-black"></div>
                            <CheckCircle className="w-16 h-16 text-emerald-500 relative z-10" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Success!</h1>
                        <p className="text-slate-500 font-medium">{message}</p>
                        <Link href="/login" className="btn-primary mt-4 w-full text-center">
                            Continue to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
                            <XCircle className="w-16 h-16 text-red-500 relative z-10" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Oops!</h1>
                        <p className="text-slate-500 font-medium">{message}</p>
                        <div className="flex flex-col gap-3 mt-4 w-full">
                            <Link href="/register" className="btn-primary w-full text-center">
                                Try Registering Again
                            </Link>
                            <Link href="/" className="btn-secondary w-full text-center">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
