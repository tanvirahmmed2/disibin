'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft, FiUser, FiCalendar, FiShield,
  FiPaperclip, FiSend, FiLoader, FiX, FiAlertCircle
} from 'react-icons/fi';

export default function UserTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params?.id;

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [attachedImages, setAttachedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (ticketId) fetchThread();
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const fetchThread = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/ticket/${ticketId}`);
      if (res.data.success) {
        setThread(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to load ticket thread');
      }
    } catch {
      toast.error('Failed to load conversation thread');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
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
          setAttachedImages(prev => [...prev, { file_url: res.data.data.url, file_id: res.data.data.public_id }]);
        } else {
          toast.error(res.data.message || 'Image upload failed');
        }
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachedImage = (index) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && attachedImages.length === 0) return;

    setSendingMsg(true);
    try {
      const payload = {
        message: messageText.trim(),
        images: attachedImages.map(img => ({ file_url: img.file_url, file_id: img.file_id }))
      };

      const res = await axios.post(`/api/user/ticket/${ticketId}`, payload);
      if (res.data.success) {
        setMessageText('');
        setAttachedImages([]);
        fetchThread();
      } else {
        toast.error(res.data.message || 'Failed to send message');
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3 p-6 text-slate-400">
        <FiLoader className="animate-spin text-sky-500" size={28} />
        <p className="text-sm font-medium">Loading ticket thread...</p>
      </div>
    );
  }

  if (!thread || !thread.ticket) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4 text-center">
        <Toaster position="top-center" />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <FiAlertCircle className="mx-auto text-amber-500" size={36} />
          <h2 className="text-lg font-bold text-slate-800">Ticket Not Found</h2>
          <Link
            href="/user/tickets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-sky-600 transition-all shadow-md"
          >
            <FiArrowLeft size={14} /> Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  const { ticket, messages, attachments } = thread;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-4">
      <Toaster position="top-center" />

      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/user/tickets"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <FiArrowLeft size={16} /> Back to My Tickets
          </Link>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
            Ticket #{ticket.id}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{ticket.title}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <FiCalendar size={12} /> Created {new Date(ticket.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-18rem)] min-h-[460px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
          {messages.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-medium">
              No messages in this thread yet. Send a message below to start the conversation.
            </div>
          ) : (
            messages.map((msg) => {
              const isUserMsg = Boolean(msg.user_id);
              const msgAttachments = attachments?.filter(att => 
                (isUserMsg && att.user_id === msg.user_id) || (!isUserMsg && att.team_id === msg.team_id)
              ) || [];

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUserMsg ? 'items-end ml-auto' : 'items-start mr-auto'} max-w-[88%] sm:max-w-[78%]`}
                >
                  {/* Sender Label */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold">
                    {isUserMsg ? (
                      <span className="text-sky-600">You</span>
                    ) : (
                      <span className="text-slate-700 flex items-center gap-1">
                        <FiShield className="text-sky-500" size={12} />
                        {msg.team_name || 'Support Staff'}
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">({msg.team_role || 'Staff'})</span>
                      </span>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`p-4 rounded-3xl shadow-sm text-sm space-y-2 ${
                      isUserMsg
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                    {/* Attachments */}
                    {msgAttachments.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {msgAttachments.map((att) => (
                          <div
                            key={att.id}
                            onClick={() => setPreviewImage(att.file_url)}
                            className="relative group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/40 bg-black/5"
                          >
                            <img
                              src={att.file_url}
                              alt="Attachment"
                              className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* User Reply Form */}
        <div className="border-t border-slate-100 bg-white/80 backdrop-blur-md p-3 sm:p-4 space-y-3">
          {/* Image Preview Strip */}
          {attachedImages.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {attachedImages.map((img, idx) => (
                <div key={idx} className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                  <img src={img.file_url} alt="Attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeAttachedImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-xs hover:bg-rose-600 transition-colors"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage || sendingMsg}
              className="p-3 text-slate-400 hover:text-sky-600 hover:bg-sky-50/80 rounded-2xl transition-all disabled:opacity-50 shrink-0"
              title="Attach image"
            >
              {uploadingImage ? <FiLoader className="animate-spin text-sky-500" size={19} /> : <FiPaperclip size={19} />}
            </button>

            <div className="flex-1 bg-slate-100/70 focus-within:bg-white rounded-2xl border border-transparent focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all p-2.5 shadow-inner">
              <textarea
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write your message... (Shift + Enter for new line)"
                rows={1}
                className="w-full bg-transparent border-0 resize-none text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none max-h-32 px-1 py-0.5"
              />
            </div>

            <button
              type="submit"
              disabled={(!messageText.trim() && attachedImages.length === 0) || uploadingImage || sendingMsg}
              className="p-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold transition-all disabled:opacity-30 shrink-0 shadow-md flex items-center justify-center"
            >
              {sendingMsg ? <FiLoader className="animate-spin" size={18} /> : <FiSend size={18} />}
            </button>
          </form>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
            >
              <FiX size={18} />
            </button>
            <img src={previewImage} alt="Attachment detail" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
