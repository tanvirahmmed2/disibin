'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiLoader, FiSend, FiCheckCircle } from 'react-icons/fi';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            return toast.error('Please enter your email address');
        }

        setSubmitting(true);
        try {
            const res = await axios.post('/api/public/subscribe', { email: email.trim() });
            if (res.data.success) {
                toast.success(res.data.message || 'Thank you for subscribing!');
                setEmail('');
            } else {
                toast.error(res.data.message || 'Subscription failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Already subscribed or invalid email');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubscribe} className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
            <Toaster position="top-center" />
            <p className="text-tertiary-light text-2xl sm:text-3xl font-extrabold text-center tracking-tight">
                Receive Latest Updates!
            </p>
            <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-3">
                <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="ENTER YOUR EMAIL"
                    required
                    className="input-style"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 text-white bg-secondary hover:bg-emerald-600 rounded-xl font-bold text-sm transition-all shadow-md shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting ? <FiLoader className="animate-spin" size={16} /> : <FiSend size={16} />}
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
            </div>
        </form>
    );
};

export default NewsLetter;