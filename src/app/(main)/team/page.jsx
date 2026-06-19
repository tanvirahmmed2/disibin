'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TeamPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get('/api/team');
        if (res.data.success) {
          setMembers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch team members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <div className="w-full relative overflow-hidden pb-10 pt-4 min-h-[80vh] flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-200/10 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/10 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse delay-1000"></div>

      {/* Header */}
      <div className="flex flex-col items-center justify-center max-w-3xl px-4 text-center mb-10 animate-fade-in">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-slate-900 font-poppins tracking-tight">
          Meet Our <span className="gradient-text">Dedicated Team</span>
        </h1>
        <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-poppins max-w-2xl">
          A collective of specialized systems architects, UI designers, and developer engineers committed to building high-performance systems and digital experiences.
        </p>
      </div>

      {/* Team grid */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/40 border border-slate-100 rounded-3xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="aspect-square w-full rounded-2xl bg-slate-200" />
                <div className="h-6 bg-slate-200 rounded w-2/3 mx-auto" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
                <div className="h-12 bg-slate-200 rounded w-full mx-auto" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border-2 border-dashed border-slate-200/80 max-w-xl mx-auto flex flex-col items-center gap-4 px-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
              <FiUser className="text-violet-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-poppins">No Members Added Yet</h3>
            <p className="text-slate-500 text-sm">
              Our team members are currently being registered. Please check back later to see our experts.
            </p>
          </div>
        ) : (
          // Members Grid
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 relative"
          >
            {members.map((m) => (
              <motion.div
                key={m.member_id}
                variants={cardVariants}
                className="flex flex-col even:flex-col-reverse justify-start text-left group w-full gap-2 relative overflow-hidden"
              >

                <div className="relative aspect-square w-full overflow-hidden  flex items-center justify-center shadow-inner transition-transform duration-500 ">
                  {m.image ? (
                    <Image
                      width={500}
                      height={500}
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-95"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-violet-500/10 to-indigo-600/10 text-violet-600 flex items-center justify-center font-bold text-4xl select-none font-poppins">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>

                  <p>{m.name}</p>
                  <p>{m.post}</p>
                  {m.bio && (
                    <p className="text-slate-500 text-xs sm:text-sm mt-2.5 leading-relaxed font-light line-clamp-4 font-poppins" title={m.bio}>
                      {m.bio}
                    </p>
                  )}
                </div>



              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
