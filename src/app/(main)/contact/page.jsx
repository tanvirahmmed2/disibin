'use client';
import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send message. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 bg-slate-50/30">
      <Toaster position="top-center" />
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-bold mb-6 tracking-tighter text-slate-900">
            Let's Start a <span className="text-sky-500">Conversation</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            Have a complex challenge or a visionary project? Our support desk and strategy team are ready to assist you.
          </p>
          <div className="space-y-6">
             <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">@</div>
                <p className="text-slate-700 font-semibold group-hover:text-sky-600 transition-colors">disibin@gmail.com</p>
             </div>
             <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">#</div>
                <p className="text-slate-700 font-semibold group-hover:text-sky-600 transition-colors">+880 1805 003886</p>
             </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-sky-500/5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe" 
                required
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com" 
                required
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project Inquiry" 
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Your Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..." 
                rows={4} 
                required
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none resize-none" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
