'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import ImageUpload from '@/component/helper/ImageUpload';

const ProductForm = ({ initialData, onSuccess, onCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_days: '',
    description: '',
    demo_url: '',
    is_lifetime: false,
    is_active: true,
    ...initialData
  });
  const [features, setFeatures] = useState(initialData?.features || []);
  const [newFeature, setNewFeature] = useState({ name: '', value: true });
  const [images, setImages] = useState(initialData?.images || []);
  const [durationOption, setDurationOption] = useState('custom');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.duration_days == 30) setDurationOption('1m');
    else if (formData.duration_days == 90) setDurationOption('3m');
    else if (formData.duration_days == 180) setDurationOption('6m');
    else if (formData.duration_days == 365) setDurationOption('1y');
    else setDurationOption('custom');
  }, []);


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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addFeature = () => {
    if (!newFeature.name.trim()) return;
    setFeatures([...features, newFeature]);
    setNewFeature({ name: '', value: true });
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/product/${initialData.product_id}` : '/api/product';
      const method = initialData ? 'patch' : 'post';

      const payload = { 
        ...formData, 
        images, 
        features,
        price: parseFloat(formData.price) || 0,
        duration_days: formData.is_lifetime ? 0 : (parseInt(formData.duration_days) || 0)
      };
      const res = await axios[method](url, payload);

      if (res.data.success) {
        toast.success(res.data.message || 'Product saved successfully');
        if (onSuccess) {
          onSuccess(res.data.data);
        } else {
          router.push('/dashboard/manager/products');
        }
      } else {
        toast.error(res.data.message || 'Failed to save product');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              placeholder="E.g. Enterprise Bundle"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Demo URL</label>
            <input
              type="url"
              name="demo_url"
              value={formData.demo_url}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              placeholder="https://demo.example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Price (USD)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="499.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Duration</label>
              <select
                value={durationOption}
                onChange={(e) => {
                  const val = e.target.value;
                  setDurationOption(val);
                  if (val === '1m') setFormData({ ...formData, duration_days: 30 });
                  else if (val === '3m') setFormData({ ...formData, duration_days: 90 });
                  else if (val === '6m') setFormData({ ...formData, duration_days: 180 });
                  else if (val === '1y') setFormData({ ...formData, duration_days: 365 });
                }}
                disabled={formData.is_lifetime}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all disabled:opacity-50"
              >
                <option value="1m">1 Month (30 Days)</option>
                <option value="3m">3 Months (90 Days)</option>
                <option value="6m">6 Months (180 Days)</option>
                <option value="1y">1 Year (365 Days)</option>
                <option value="custom">Custom</option>
              </select>
              
              {durationOption === 'custom' && (
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  required={!formData.is_lifetime}
                  disabled={formData.is_lifetime}
                  className="w-full px-5 py-3 mt-2 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all disabled:opacity-50"
                  placeholder="Enter days"
                />
              )}
            </div>

          </div>
        </div>

        <div className="space-y-6">
          <ImageUpload onUpload={handleImageUpload} label="Upload Product Images" />
          
          {/* Image List */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {images.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200">
                  <img src={img.url} alt="Product" className="w-full h-24 object-cover" />
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

          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_lifetime ? 'bg-sky-500 border-sky-500' : 'border-slate-300'}`}>
                {formData.is_lifetime && <FiCheck className="text-white" />}
              </div>
              <input type="checkbox" name="is_lifetime" checked={formData.is_lifetime} onChange={handleChange} className="hidden" />
              <span className="text-sm font-bold text-slate-700 group-hover:text-sky-600 transition-colors">Lifetime</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_active ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                {formData.is_active && <FiCheck className="text-white" />}
              </div>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="hidden" />
              <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Active</span>
            </label>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiCheck className="text-emerald-500" /> Product Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
          <input
            type="text"
            placeholder="Feature name (e.g. 24/7 Support)"
            className="px-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm"
            value={newFeature.name}
            onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
          />

          <button
            type="button"
            onClick={addFeature}
            className="bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
          >
            <FiPlus /> Add Feature
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div>
                <p className="font-bold text-slate-900 text-sm">{feature.name}</p>

              </div>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          {features.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2rem]">
              No features added yet. Highlight what makes this product great!
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Detailed Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-6 py-4 rounded-[2rem] border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-none"
          placeholder="Describe the product value proposition in detail..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-10 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
        >
          {loading ? 'Processing...' : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
