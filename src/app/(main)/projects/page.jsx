'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import Image from 'next/image';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/project');
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-7xl bg-clip-text font-poppins">
            Our Successful Projects
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Discover how we&apos;ve helped businesses transform and grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const primaryImage = project.images?.find(img => img.is_primary)?.url || project.images?.[0]?.url;
            
            return (
              <div key={project.project_id} className="bg-white rounded-lg shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-300 group flex flex-col">
               
                <div className="h-56 bg-linear-to-br from-emerald-400 to-gray-500 relative flex items-center justify-center overflow-hidden">
                  {primaryImage ? (
                    <Image width={1000} height={1000} src={primaryImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="text-white text-2xl font-bold opacity-30">{project.title}</div>
                  )}
                </div>

                <div className="p-6 grow flex flex-col">
                  <h2 className="text-2xl font-bold text-slate-900 group-hover:text-gray-600 transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-slate-600 text-sm line-clamp-3 grow">
                    {project.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <Link href={`/projects/${project.slug}`} className="text-gray-600 font-bold hover:text-gray-700 flex items-center gap-1 group/link">
                      View Case Study
                      <FiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors" title="Visit Live Site">
                        <FiExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-3xl">
            No projects available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
