'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import ImageUpload from '@/component/helper/ImageUpload';

const ProjectForm = ({ initialData, onSuccess, onCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    live_url: '',
    ...initialData
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/category');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleImageUpload = (imageData) => {
    setImages([...images, { ...imageData, is_primary: images.length === 0 }]);
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
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
           <ImageUpload onUpload={handleImageUpload} label="Project Showcase Image" />
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
