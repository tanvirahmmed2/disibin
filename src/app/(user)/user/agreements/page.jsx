'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import {
  FiBookOpen, FiExternalLink, FiCheckCircle, FiXCircle,
  FiLoader, FiClock, FiRefreshCw
} from 'react-icons/fi';

export default function UserAgreementsPage() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/user/agreements');
      if (res.data.success) {
        setAgreements(res.data.data);
      }
    } catch {
      toast.error('Failed to load your agreements');
    } finally {
      setLoading(false);
    }
  };

  const handleSignAgreement = async (agreementId, newStatus) => {
    setUpdatingId(agreementId);
    try {
      const res = await axios.patch('/api/user/agreements', {
        agreement_id: agreementId,
        status: newStatus
      });
      if (res.data.success) {
        toast.success(`Agreement marked as ${newStatus}`);
        setAgreements(prev => prev.map(a => a.id === agreementId ? { ...a, status: newStatus } : a));
      } else {
        toast.error(res.data.message || 'Failed to update agreement');
      }
    } catch {
      toast.error('Failed to update agreement status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <Toaster position="top-center" />

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FiBookOpen size={20} />
            </span>
            My Service & Project Agreements
          </h1>
          <p className="text-slate-500 text-sm pl-11">
            Review and sign legal service contracts and project scope documents
          </p>
        </div>

        <button
          onClick={fetchAgreements}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-xs self-start sm:self-auto shadow-sm"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
          Refresh List
        </button>
      </div>

      {/* Agreements List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FiLoader className="animate-spin mx-auto text-primary" size={28} />
            <p className="text-sm font-medium">Loading your agreements...</p>
          </div>
        ) : agreements.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <FiBookOpen className="mx-auto text-slate-300" size={32} />
            <p className="font-bold text-slate-800 text-base">No agreements assigned</p>
            <p className="text-xs text-slate-500">There are no project agreements requiring your signature at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {agreements.map((a) => (
              <div key={a.id} className="p-6 space-y-3 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{a.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      a.status === 'signed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : a.status === 'rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Project: <span className="font-semibold text-slate-700">{a.project_title || `Project #${a.project_id}`}</span>
                    <span> · Created {new Date(a.created_at).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={a.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-primary text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <FiExternalLink size={13} /> View PDF
                  </a>

                  {a.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleSignAgreement(a.id, 'signed')}
                        disabled={updatingId === a.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                      >
                        Sign Agreement
                      </button>
                      <button
                        onClick={() => handleSignAgreement(a.id, 'rejected')}
                        disabled={updatingId === a.id}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all border border-rose-100 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
