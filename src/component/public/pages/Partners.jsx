"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { FaHandshake, FaExternalLinkAlt } from "react-icons/fa";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await axios.get('/api/public/partner');
      if (res.data.success) {
        setPartners(res.data.data);
      }
    } catch {
      console.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  if (loading || partners.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50/50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-100 text-xs font-bold uppercase tracking-wider">
            <FaHandshake size={14} /> Our Trusted Ecosystem
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Valued Industry Partners
          </h2>
          <p className="text-slate-500 text-sm">
            Collaborating with leading enterprises and innovative platforms worldwide
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} />
          ))}
        </div>

      </div>
    </section>
  );
}

function PartnerCard({ partner }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <a
      href={partner.business_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all flex flex-col items-center justify-center text-center space-y-3"
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        {partner.image && !imgErr ? (
          <img
            src={partner.image}
            alt={partner.company_name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 font-extrabold text-xl flex items-center justify-center">
            {partner.company_name?.charAt(0).toUpperCase() || 'P'}
          </div>
        )}
      </div>

      <div className="space-y-1 w-full">
        <p className="font-bold text-slate-800 text-xs truncate group-hover:text-sky-600 transition-colors">
          {partner.company_name}
        </p>
        <span className="text-[10px] text-slate-400 font-medium inline-flex items-center gap-1 group-hover:underline">
          Visit <FaExternalLinkAlt size={8} />
        </span>
      </div>
    </a>
  );
}
