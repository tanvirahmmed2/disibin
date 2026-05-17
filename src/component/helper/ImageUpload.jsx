'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';

const ImageUpload = ({ onUpload, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        onUpload(res.data.data);
      }
    } catch (error) {
      console.error('Upload failed', error);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative group">
        <div className={`
          relative w-full h-40 rounded-2xl border-2 border-dashed transition-all
          flex flex-col items-center justify-center cursor-pointer overflow-hidden
          ${preview ? 'border-sky-500' : 'border-slate-200 hover:border-sky-400 bg-slate-50/50'}
        `}>
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <FiUploadCloud className="w-8 h-8 text-slate-400 group-hover:text-sky-500 transition-colors mb-2" />
              <p className="text-xs text-slate-500 font-medium">Click or drag to upload</p>
            </>
          )}
          
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={uploading}
          />

          {uploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <FiLoader className="w-8 h-8 text-sky-500 animate-spin mb-2" />
              <p className="text-xs font-bold text-sky-600">Uploading...</p>
            </div>
          )}

          {preview && !uploading && (
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <p className="text-white text-xs font-bold px-3 py-1 bg-slate-900/60 rounded-full backdrop-blur-md">Change Image</p>
            </div>
          )}
        </div>
        
        {preview && !uploading && (
           <div className="absolute top-2 right-2 flex gap-1">
              <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                <FiCheckCircle size={14} />
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); setPreview(null); }}
                className="bg-rose-500 text-white p-1 rounded-full shadow-lg hover:bg-rose-600 transition-colors"
              >
                <FiX size={14} />
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
