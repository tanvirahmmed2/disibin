'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiSend, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

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
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10"
        >
            <Toaster position="top-center" />
            <div className="text-center md:text-left space-y-1">
                <h3 className="text-white text-xl sm:text-2xl font-bold font-poppins">
                    Subscribe to Our Newsletter
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-poppins">
                    Get the latest updates and insights directly to your inbox.
                </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2 max-w-md">
                <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter your email address"
                    required
                    className="input-style"
                />
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white rounded-xl font-semibold text-sm transition-all shadow-md shrink-0 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-poppins"
                >
                    {submitting ? <FiLoader className="animate-spin" size={16} /> : <FiSend size={16} />}
                    <span>{submitting ? 'Subscribing...' : 'Subscribe'}</span>
                </motion.button>
            </form>
        </motion.div>
    );
};

export default NewsLetter;