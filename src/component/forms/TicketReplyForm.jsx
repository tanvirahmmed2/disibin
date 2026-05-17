'use client';
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
      const res  = await fetch(`/api/ticket/${ticket.ticket_id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      });
      const data = await res.json();
      if (data.success) {
        onSent?.({ ...data.data, user_name: 'You', user_role: 'user' });
        setReply('');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Add a reply..."
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!reply.trim() || sending}
          className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
};

export default TicketReplyForm;
