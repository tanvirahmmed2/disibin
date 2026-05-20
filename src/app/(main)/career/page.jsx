'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const CareerPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/career');
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleJob = (id) => {
    if (expandedJob === id) {
      setExpandedJob(null);
    } else {
      setExpandedJob(id);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col pt-24 pb-16 px-4">
      <section className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-6 mb-20 text-center animate-fade-up">
        
        <h1 className="font-poppins text-4xl sm:text-6xl font-semibold text-slate-900 leading-tight">
          Shape the Future of <br className="hidden sm:block" />
          <span className="gradient-text">Digital Excellence</span>
        </h1>
        <p className="text-slate-500 w-full text-sm sm:text-base font-medium">
          We&apos;re a high-care studio built on clarity and impact. If you&apos;re passionate about 
          crafting premium digital experiences, we&apos;d love to meet you.
        </p>
      </section>

      {/* Jobs Section */}
      <section className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        <h2 className="font-poppins text-2xl font-semibold text-slate-900 mb-4 animate-fade-up delay-100">
          Open Positions
        </h2>

        {loading ? (
          <div className="w-full py-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="w-full p-8 glass rounded-2xl text-center text-slate-500 animate-fade-up delay-200">
            There are currently no open positions. Please check back later!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job, idx) => (
              <div 
                key={job.job_id} 
                className={`w-full glass rounded-2xl overflow-hidden transition-all duration-300 animate-fade-up delay-${(idx % 5 + 2) * 100}`}
              >
                {/* Job Header */}
                <div 
                  className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/40 transition-colors"
                  onClick={() => toggleJob(job.job_id)}
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{job.job_type}</span>
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{job.level}</span>
                      <span className="px-2 py-1 bg-sky-50 text-sky-600 rounded-md">{job.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                      {job.compensation}
                    </span>
                    <button className="text-slate-400 hover:text-sky-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${expandedJob === job.job_id ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedJob === job.job_id ? 'max-h-500 border-t border-slate-200/50' : 'max-h-0'}`}>
                  <div className="p-6 flex flex-col gap-6 text-sm text-slate-600">
                    
                    {job.description && (
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-slate-900">About the Role</h4>
                        <p className="whitespace-pre-wrap">{job.description}</p>
                      </div>
                    )}

                    {job.responsibilities && (
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-slate-900">Responsibilities</h4>
                        <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                      </div>
                    )}

                    {job.skills && (
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-slate-900">Required Skills</h4>
                        <p className="whitespace-pre-wrap">{job.skills}</p>
                      </div>
                    )}

                    {job.nice_to_have && (
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-slate-900">Nice to Have</h4>
                        <p className="whitespace-pre-wrap">{job.nice_to_have}</p>
                      </div>
                    )}

                    <div className="pt-4 mt-2 border-t border-slate-200/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 sm:hidden">
                        {job.compensation}
                      </span>
                      <a 
                        href={`mailto:careers@disibin.com?subject=Application for ${job.title}`}
                        className="ml-auto px-6 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors shadow-lg shadow-slate-900/10"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CareerPage;
