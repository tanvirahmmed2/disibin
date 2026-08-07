"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { FaHandshake, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [partners]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 230; // card width (208px) + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading || partners.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Valued Industry Partners
          </h2>
          <p className="text-slate-500 text-sm">
            Collaborating with leading enterprises and innovative platforms worldwide
          </p>
        </div>

        <div className="relative group/slider">

          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 hover:text-primary hover:bg-white hover:scale-110 transition-all focus:outline-none cursor-pointer"
              aria-label="Scroll left"
            >
              <FaChevronLeft size={14} />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 shadow-md border border-slate-200 text-slate-700 hover:text-primary hover:bg-white hover:scale-110 transition-all focus:outline-none cursor-pointer"
              aria-label="Scroll right"
            >
              <FaChevronRight size={14} />
            </button>
          )}

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="w-full overflow-x-auto scroll-smooth py-3 scrollbar-none snap-x snap-mandatory flex"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex items-center justify-center min-w-full w-max gap-4 sm:gap-6 px-4">
              {partners.map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

function PartnerCard({ partner }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="group bg-white p-5 w-52 shrink-0 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center space-y-3 snap-center select-none"
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        {partner.image && !imgErr ? (
          <Image
            width={300}
            height={300}
            src={partner.image}
            alt={partner.company_name || "Partner"}
            onError={() => setImgErr(true)}
            className="w-full h-full object-contain filter transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary font-extrabold text-xl flex items-center justify-center">
            {partner.company_name?.charAt(0).toUpperCase() || 'P'}
          </div>
        )}
      </div>

      <div className="space-y-1 w-full">
        <p className="font-bold text-slate-800 text-xs truncate group-hover:text-primary transition-colors">
          {partner.company_name}
        </p>
        <a href={partner.business_url || '#'}
          target="_blank"
          rel="noopener noreferrer" className="text-[10px] cursor-pointer text-slate-400 font-medium inline-flex items-center gap-1 hover:text-primary group-hover:underline">
          Visit <FaExternalLinkAlt size={8} />
        </a>
      </div>
    </div>
  );
}
