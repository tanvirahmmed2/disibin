'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { use } from 'react';
import { FiArrowLeft, FiLayers } from 'react-icons/fi';
import Link from 'next/link';
import ProjectForm from '@/component/forms/ProjectForm';

const ProjectEditPage = ({ params }) => {
  const { slug } = use(params);
  const isNew = slug === 'new';
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [slug]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/project/${slug}`);
      if (res.data.success) {
        setProject(res.data.data);
      } else {
        toast.error('Project not found');
      }
    } catch (error) {
      toast.error('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Toaster position="top-center" />
      
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/manager/projects" 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <FiArrowLeft /> Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FiLayers size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {isNew ? 'Create New Project' : 'Edit Project Portfolio'}
              </h1>
              <p className="text-slate-500 font-medium">
                {isNew ? 'Showcase a new successful case study' : `Currently editing: ${project?.title || '...'}`}
              </p>
            </div>
          </div>
        </div>

        <div className="p-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold animate-pulse">Fetching project data...</p>
            </div>
          ) : (
            <ProjectForm 
              initialData={project} 
              onCancel={() => window.history.back()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectEditPage;
