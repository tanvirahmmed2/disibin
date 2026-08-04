'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/partner');
        if (res.data.success) setPartners(res.data.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading || partners.length === 0) return null;

  return (
    <section className="w-full py-16  my-8 flex flex-col items-center gap-10 rounded-[2.5rem]  overflow-hidden ">

      <div className="text-center space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-sky-500">Trusted By</p>
        <h2 className="text-3xl md:text-5xl font-poppins text-slate-900">Our Partners & Collaborators</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          We work alongside world-class organisations to deliver outstanding results.
        </p>
      </div>

      <div className="w-full ">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {partners.map((p) => (
            <PartnerCard key={p.partner_id} partner={p} />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 font-medium">
        {partners.length} partner{partners.length !== 1 ? 's' : ''} & growing
      </p>

    </section>
  );
};

function PartnerCard({ partner }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="w-full max-w-50 group cursor-default select-none">
      <div className="flex flex-col items-center gap-3 w-full p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
        {/* Logo */}
        <div className="h-14 flex items-center justify-center w-full">
          {partner.logo && !imgErr ? (
            <Image width={500} height={500}
              src={partner.logo}
              alt={partner.name}
              className="max-h-12 max-w-full object-contain transition-all duration-300"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">
              {partner.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Name */}
        <p className="font-semibold text-slate-800 text-sm text-center line-clamp-1">{partner.name}</p>
        {/* Description tooltip-style */}
        {partner.description && (
          <p className="text-[10px] text-slate-400 text-center line-clamp-2 leading-relaxed">{partner.description}</p>
        )}
      </div>
    </div>
  );
}

export default Partners;
