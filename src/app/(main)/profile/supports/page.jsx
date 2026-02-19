'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeadset, FaPaperPlane, FaChevronRight, FaRegDotCircle, FaCheckCircle, FaInbox } from 'react-icons/fa';
import Link from 'next/link';
import { MdDeleteOutline } from 'react-icons/md';

const Supports = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/user/sent_supports', { withCredentials: true });
      setTickets(res.data.payload);
    } catch (error) {
      console.error("Error loading support tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchTickets();
  }, []);

  const deleteticket = async (id) => {
    const confirm= window.confirm('Message will be deleted permanently')
    if(!confirm) return
    try {
      const res = await axios.delete('/api/support', { data: { id }, withCredentials: true })
      alert(res.data.message)
      fetchTickets();
    } catch (error) {
      alert(error?.response?.data.message || 'Failed to delte ticket')

    }
  }

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 w-full bg-white rounded-2xl animate-pulse border border-slate-100" />
      ))}
    </div>
  );

  return (
    <div className="w-full p-1 sm:p-4 flex flex-col items-center justify-center gap-6">

      <div className="flex w-full justify-between items-center px-2">
        <h2 className="text-xl font-light text-slate-800 tracking-tight">Support History</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-sky-100 transition-all active:scale-95">
          <FaPaperPlane className="" />
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col w-full items-center justify-center py-20 bg-white/40 border border-dashed border-slate-200 rounded-3xl">
          <FaInbox className="text-slate-100 text-5xl mb-4" />
          <p className="text-slate-400 font-light tracking-wide">No support requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 w-full">
          {tickets.map((ticket) => (
            <div
              key={ticket.support_id}
              className="group bg-white p-5 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50/50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-colors ${ticket.status === 'read'
                    ? 'bg-emerald-50 text-emerald-500'
                    : 'bg-slate-50 text-slate-300 group-hover:bg-sky-50 group-hover:text-sky-500'
                  }`}>
                  {ticket.status === 'read' ? <FaCheckCircle /> : <FaRegDotCircle />}
                </div>

                <div>
                  <h4 className=" font-medium text-slate-800 group-hover:text-sky-600 transition-colors">
                    {ticket.subject}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <p className=" text-slate-400 font-bold uppercase tracking-widest">
                      ID: #S-{1000 + (ticket.support_id || i)}
                    </p>
                    {
                      ticket.status === 'replied' && <p>Check email</p>
                    }
                    <span className="text-slate-200">•</span>
                    <p className=" text-slate-400">
                      {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border ${ticket.status === 'read'
                      ? 'border-emerald-100 text-emerald-500'
                      : 'border-slate-100 text-slate-400'
                    }`}>
                    {ticket.status}
                  </span>
                </div>
                <MdDeleteOutline onClick={() => deleteticket(ticket.support_id)} className='text-3xl text-red-500 cursor-pointer'/>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full mt-10 p-6 bg-linear-to-r from-sky-600 to-emerald-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-sky-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl">
            <FaHeadset />
          </div>
          <div>
            <h3 className="font-medium">Need immediate help?</h3>
            <p className="text-white/70 text-xs font-light">Our dedicated team is available for 24/7 technical assistance.</p>
          </div>
        </div>
        <Link href={'https://api.whatsapp.com/send/?phone=8801805003886&text&type=phone_number&app_absent=0'} className="px-6 py-2 bg-white text-sky-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-opacity-90 transition-all active:scale-95">
          Live Chat
        </Link>
      </div>
    </div>
  );
};

export default Supports;