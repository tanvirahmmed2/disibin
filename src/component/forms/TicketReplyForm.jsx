'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import TiptapEditor from '@/component/forms/TiptapEditor';

/**
 * TicketReplyForm
 * ---------------
 * Inline reply input at the bottom of a ticket thread.
 *
 * Props
 *   ticket    — the active ticket object (needs .ticket_id, .status)
 *   onSent    — (newMessage) => void, called with the new message after it is sent
 *   currentUserId — number, used to tag the message as "You"
 */
const TicketReplyForm = ({ ticket, onSent, currentUserId }) => {
  const [reply,   setReply]   = useState('');
  const [sending, setSending] = useState(false);

  if (!ticket || ticket.status === 'closed' || ticket.status === 'resolved') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(`/api/ticket/${ticket.ticket_id}/message`, { message: reply });
      const data = res.data;
      if (data.success) {
        onSent?.({ ...data.data, user_name: 'You', user_role: 'user' });
        setReply('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <TiptapEditor
            value={reply}
            onChange={setReply}
            placeholder="Add a reply..."
            hideToolbar={true}
            minHeight="50px"
          />
        </div>
        <button
          type="submit"
          disabled={!reply.trim() || reply === '<p></p>' || sending}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px] h-[48px] self-end mb-2"
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
};

export default TicketReplyForm;
