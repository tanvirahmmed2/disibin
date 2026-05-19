
'use client';
import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(result.message || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 ">

      <Toaster position="top-center" />

      <div className="w-full max-w-7xl grid grid-cols-1 gap-10 items-center">

        <div className="flex flex-col gap-8">

          <div className="flex flex-col gap-4">
            

            <h1 className="text-6xl sm:text-8xl font-poppins leading-none text-slate-900">
              Let’s build something exceptional.
            </h1>

            <p className="font-poppins text-slate-600 text-lg leading-relaxed max-w-xl">
              Have a complex challenge, innovative startup, or enterprise-scale
              project? Our strategy, development, and support teams are ready
              to collaborate with you.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-poppins">

            <div className="flex flex-col gap-1">
              <span className="text-sm uppercase tracking-widest text-slate-400">
                Email
              </span>
              <p className="text-slate-800 text-lg">
                disibin@gmail.com
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm uppercase tracking-widest text-slate-400">
                Phone
              </span>
              <p className="text-slate-800 text-lg">
                +8801805003886
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm uppercase tracking-widest text-slate-400">
                Address
              </span>
              <p className="text-slate-800 text-lg">
                Mymensingh, Bangladesh
              </p>
            </div>

          </div>
        </div>

        <div className="w-full">

          <form
            onSubmit={handleSubmit}
            className="w-full bg-white/80 backdrop-blur-xl border border-white/50 shadow rounded-3xl p-6 sm:p-10 flex flex-col gap-5"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-sky-400 transition-all duration-300"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-sky-400 transition-all duration-300"
              />

            </div>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Project Subject"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-sky-400 transition-all duration-300"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project, business goals, or technical requirements..."
              rows={6}
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none resize-none focus:border-sky-400 transition-all duration-300"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-sky-600 transition-all duration-300 flex items-center justify-center gap-3 ${
                loading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 
                      0 0 5.373 0 12h4zm2 5.291A7.962 
                      7.962 0 014 12H0c0 3.042 1.135 
                      5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>

                  Sending Message...
                </>
              ) : (
                'Send Message'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
