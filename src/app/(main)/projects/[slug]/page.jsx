'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      try {
        const res = await axios.get(`/api/project/${slug}`);
        if (res.data.success) {
          setProject(res.data.data);
          const primary = res.data.data.images?.find(img => img.is_primary);
          setActiveImage(primary?.url || res.data.data.images?.[0]?.url);
        } else {
          toast.error("Project not found");
          router.push('/projects');
        }
      } catch (error) {
        console.error('Failed to fetch project', error);
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/projects" className="inline-flex items-center gap-2 text-slate-600 hover:text-gray-600 font-bold mb-8 transition-colors">
          <FiArrowLeft /> Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 rounded-lg shadow-xl shadow-slate-100 border border-slate-100 p-8">
          
          <div className="space-y-4">
            <div className="relative h-96 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
              {activeImage ? (
                <Image width={1000} height={1000} src={activeImage} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-300 text-4xl font-bold">No Image</div>
              )}
            </div>
            
            {project.images && project.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img.url ? 'border-gray-500 shadow-lg shadow-gray-100' : 'border-transparent hover:border-slate-200'}`}
                  >
                    <Image width={1000} height={1000} src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex-grow">
              <h1 className="text-4xl font-extrabold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-600">
                {project.title}
              </h1>
              
              <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">About the Project</h3>
                <p className="text-slate-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Action Button */}
            {project.live_url && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-600 text-white py-4 rounded-2xl font-bold hover:from-gray-700 hover:to-gray-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-100 group"
                >
                  <FiExternalLink className="group-hover:scale-110 transition-transform" />
                  Visit Live Project
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );};

export default ProjectDetailPage;
