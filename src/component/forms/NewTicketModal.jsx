'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiX, FiPaperclip, FiLoader, FiPlusCircle } from 'react-icons/fi';

export default function NewTicketModal({ isOpen, onClose, onSuccess }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error('Only image files are allowed');
          continue;
        }
        const formData = new FormData();
        formData.append('image', file);

        const res = await axios.post('/api/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          setImages(prev => [...prev, { file_url: res.data.data.url, file_id: res.data.data.public_id }]);
        } else {
          toast.error(res.data.message || 'Upload failed');
        }
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      return toast.error('Subject and initial message are required');
    }

    setSubmitting(true);
    try {
      const res = await axios.post('/api/user/ticket', {
        subject: subject.trim(),
        message: message.trim(),
        images: images.map(img => ({ file_url: img.file_url, file_id: img.file_id }))
      });

      if (res.data.success) {
        toast.success('Ticket created successfully!');
        setSubject('');
        setMessage('');
        setImages([]);
        onClose();
        onSuccess?.(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to create ticket');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FiPlusCircle className="text-primary" size={20} />
            Create Support Ticket
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ticket Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="E.g. Issue with billing / project inquiry"
              required
              className="input-style"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Initial Message *
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue or inquiry in detail..."
              rows={4}
              required
              className="input-style resize-none"
            />
          </div>

          {/* Image Attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Image Attachments (Optional)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || submitting}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                {uploading ? <FiLoader className="animate-spin" size={12} /> : <FiPaperclip size={12} />}
                Add Screenshot
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            {images.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                {images.map((img, idx) => (
                  <div key={idx} className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
                    <img src={img.file_url} alt="Attachment" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px] hover:bg-rose-600"
                    >
                      <FiX size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-5 py-2.5 bg-slate-900 hover:bg-primary text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md flex items-center gap-2"
            >
              {submitting ? <FiLoader className="animate-spin" size={14} /> : null}
              {submitting ? 'Creating Ticket...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
