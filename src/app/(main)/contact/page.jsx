import React from 'react'

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-bold mb-6 tracking-tighter text-slate-900">
            Let's Start a <span className="text-sky-500">Conversation</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            Have a complex challenge or a visionary project? Our support desk and strategy team are ready to assist you.
          </p>
          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold">@</div>
                <p className="text-slate-700 font-semibold">disibin@gmail.com</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold">#</div>
                <p className="text-slate-700 font-semibold">+880 1805 003886</p>
             </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-sky-500/5">
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" />
            <input type="email" placeholder="Your Email" className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none" />
            <textarea placeholder="How can we help?" rows={4} className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 transition-all outline-none resize-none" />
            <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
