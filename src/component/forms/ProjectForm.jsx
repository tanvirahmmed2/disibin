'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import ImageUpload from '@/component/helper/ImageUpload';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

const ProjectForm = ({ initialData, onSuccess, onCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    live_url: '',
    ...initialData
  });
  const [images, setImages] = useState(initialData?.images || []);
  const [loading, setLoading] = useState(false);


  const handleImageUpload = (imageData) => {
    setImages([...images, { ...imageData, is_primary: images.length === 0 }]);
  };

  const handleSetPrimary = (index) => {
    setImages(images.map((img, i) => ({
      ...img,
      is_primary: i === index
    })));
  };

  const handleRemoveImage = async (index) => {
    const imgToRemove = images[index];
    
    // If it's a newly uploaded image (not in DB), delete from Cloudinary
    if (!imgToRemove.id && imgToRemove.public_id) {
      try {
        await axios.delete(`/api/image?public_id=${imgToRemove.public_id}`);
      } catch (error) {
        console.error("Failed to delete orphaned image from Cloudinary:", error);
      }
    }
    
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'title') {
      const generatedSlug = slugify(value, { lower: true, strict: true });
      setFormData({
        ...formData,
        title: value,
        slug: generatedSlug
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/project/${initialData.project_id}` : '/api/project';
      const method = initialData ? 'patch' : 'post';
      
      const payload = { ...formData, images };
      const res = await axios[method](url, payload);
      
      if (res.data.success) {
        toast.success(res.data.message || 'Project saved successfully');
        if (onSuccess) {
          onSuccess(res.data.data);
        } else {
          router.push('/dashboard/manager/projects');
        }
      } else {
        toast.error(res.data.message || 'Failed to save project');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              placeholder="E.g. Disibin Platform"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Live URL</label>
            <input
              type="url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="space-y-6">
           <ImageUpload onUpload={handleImageUpload} label="Upload Project Images" />
           
           {/* Image List */}
           {images.length > 0 && (
             <div className="grid grid-cols-2 gap-4 mt-2">
               {images.map((img, index) => (
                 <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200">
                   <img src={img.url} alt="Project" className="w-full h-24 object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button
                       type="button"
                       onClick={() => handleSetPrimary(index)}
                       className={`p-1.5 rounded-full ${img.is_primary ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 hover:bg-emerald-500 hover:text-white'} transition-colors`}
                       title={img.is_primary ? "Primary Image" : "Set as Primary"}
                     >
                       <FiCheck size={14} />
                     </button>
                     <button
                       type="button"
                       onClick={() => handleRemoveImage(index)}
                       className="p-1.5 rounded-full bg-white text-slate-700 hover:bg-rose-500 hover:text-white transition-colors"
                       title="Remove Image"
                     >
                       <FiTrash2 size={14} />
                     </button>
                   </div>
                   {img.is_primary && (
                     <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                       Primary
                     </div>
                   )}
                 </div>
               ))}
             </div>
           )}

           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Generated Slug</label>
             <code className="text-sm text-sky-600 font-bold">{formData.slug || 'slug-will-appear-here'}</code>
           </div>
        </div>
      </div>


      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
          placeholder="Detailed project description..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-sky-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
