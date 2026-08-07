'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiSend, FiPaperclip, FiX, FiLoader, FiImage } from 'react-icons/fi';

export default function TicketReplyForm({ ticketId, onSent, isTeam = false }) {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

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
          toast.error(res.data.message || 'Image upload failed');
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
    if (e) e.preventDefault();
    if (!message.trim() && images.length === 0) return;

    setSending(true);
    try {
      const endpoint = isTeam ? `/api/team/ticket/${ticketId}` : `/api/user/ticket/${ticketId}`;
      const payload = {
        message: message.trim(),
        images: images.map(img => ({ file_url: img.file_url, file_id: img.file_id }))
      };

      const res = await axios.post(endpoint, payload);
      if (res.data.success) {
        setMessage('');
        setImages([]);
        onSent?.(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to send reply');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-slate-100 bg-white/80 backdrop-blur-md p-3 sm:p-4 space-y-3">
      {/* Image Attachments Preview Strip */}
      {images.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <div key={idx} className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
              <img src={img.file_url} alt="Attachment preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-xs hover:bg-rose-600 transition-colors shadow-md"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message Input Container */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || sending}
          className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all disabled:opacity-50 shrink-0"
          title="Attach image"
        >
          {uploading ? <FiLoader className="animate-spin text-primary" size={19} /> : <FiPaperclip size={19} />}
        </button>

        <div className="flex-1 bg-slate-100/70 focus-within:bg-white rounded-2xl border border-transparent focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all p-2.5 shadow-inner">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Write your message... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            className="w-full bg-transparent border-0 resize-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none max-h-32 px-1 py-0.5"
          />
        </div>

        <button
          type="submit"
          disabled={(!message.trim() && images.length === 0) || uploading || sending}
          className="p-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold transition-all disabled:opacity-30 disabled:hover:bg-primary shrink-0 shadow-md flex items-center justify-center"
        >
          {sending ? <FiLoader className="animate-spin" size={18} /> : <FiSend size={18} />}
        </button>
      </form>
    </div>
  );
}
