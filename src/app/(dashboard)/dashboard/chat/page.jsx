"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaUsers, FaPaperPlane, FaPlus, FaTimes, FaCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const [inbox, setInbox] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  
  // New Chat Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managementUsers, setManagementUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.conversation_id);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchInbox = async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (data.success) {
        setInbox(data.data);
      } else {
        toast.error(data.message || 'Failed to load inbox');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching inbox');
    } finally {
      setLoadingInbox(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/${conversationId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      } else {
        toast.error(data.message || 'Failed to load messages');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const res = await fetch(`/api/chat/${activeChat.conversation_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.data]);
        setNewMessage('');
        fetchInbox(); // Refresh inbox to update last message
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error sending message');
    }
  };

  const openNewChatModal = async () => {
    setIsModalOpen(true);
    setSelectedUsers([]);
    setGroupTitle('');
    try {
      const res = await fetch('/api/user/management');
      const data = await res.json();
      if (data.success) {
        setManagementUsers(data.data);
      } else {
        toast.error(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching users');
    }
  };

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const createNewChat = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    const isGroup = selectedUsers.length > 1;
    if (isGroup && !groupTitle.trim()) {
      toast.error('Please enter a group title');
      return;
    }

    setCreatingChat(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isGroup,
          title: groupTitle,
          participantIds: selectedUsers
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
        fetchInbox();
        // Optional: auto-open the new chat if possible
        if (data.data && data.data.conversation_id) {
           setActiveChat(data.data);
           fetchMessages(data.data.conversation_id);
        }
      } else {
        toast.error(data.message || 'Failed to create chat');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error creating chat');
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      
      {/* Sidebar - Inbox */}
      <div className="w-1/3 min-w-[280px] border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          <button 
            onClick={openNewChatModal}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            title="New Chat"
          >
            <FaPlus size={14} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingInbox ? (
            <div className="p-6 flex justify-center text-gray-400"><span className="animate-pulse">Loading...</span></div>
          ) : inbox.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No conversations yet.</div>
          ) : (
            inbox.map((chat) => (
              <div 
                key={chat.conversation_id}
                onClick={() => setActiveChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-center gap-3 ${activeChat?.conversation_id === chat.conversation_id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-white border-l-4 border-l-transparent'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  {chat.is_group ? <FaUsers size={20} /> : <FaUser size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {chat.is_group ? chat.title : chat.other_participant_name}
                    </h3>
                    {chat.last_message_time && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(chat.last_message_time).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.last_message ? (
                      <>
                        <span className="font-medium">{chat.sender_id === chat.created_by ? 'You' : chat.sender_name}: </span>
                        {chat.last_message}
                      </>
                    ) : 'No messages yet'}
                  </p>
                </div>
                {chat.last_message_time && chat.last_read_at && new Date(chat.last_message_time) > new Date(chat.last_read_at) && chat.sender_id !== chat.created_by && (
                   <FaCircle className="text-blue-600 text-[10px]" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                {activeChat.is_group ? <FaUsers size={18} /> : <FaUser size={18} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {activeChat.is_group ? activeChat.title : activeChat.other_participant_name}
                </h3>
                <p className="text-xs text-gray-500">
                  {activeChat.is_group ? 'Group Conversation' : 'Private Conversation'}
                </p>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
              {loadingMessages ? (
                <div className="flex justify-center p-4 text-gray-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Send a message to start the conversation.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    // We don't have the current user's ID directly in state easily unless we decode token or just assume 
                    // based on if they are the sender. Let's rely on inbox sender check or just if their name is not the other participant's
                    const isMe = !activeChat.is_group && msg.sender_name !== activeChat.other_participant_name;
                    // For groups, it's a bit trickier without user ID. We can compare with activeChat data if needed, or we just fetch user ID.
                    // A better way is to pass current userId from the layout or API.
                    // For now, let's assume if msg.sender_name is the current session user. Since we don't have it, we'll try to infer.
                    // Actually, msg.sender_id === (some session ID). Let's just use a visual trick if it's their own message by checking if they were the sender of the last message in the inbox.
                    // Wait, let's just make it generic for now or fetch session.
                    return (
                      <div key={msg.message_id || index} className={`flex flex-col ${msg.sender_id === activeChat.sender_id ? 'items-end' : 'items-start'}`}>
                         <span className="text-xs text-gray-400 mb-1 ml-1">{msg.sender_name}</span>
                        <div className={`px-4 py-2 rounded-2xl max-w-[75%] ${msg.sender_id === activeChat.sender_id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
                >
                  <FaPaperPlane size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <FaPaperPlane size={32} />
            </div>
            <p className="text-lg font-medium text-gray-500">Your Messages</p>
            <p className="text-sm">Select a conversation or start a new one</p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">New Conversation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <p className="text-sm text-gray-500 mb-3">Select one or more team members to start chatting.</p>
              
              <div className="space-y-2 mb-4">
                {managementUsers.map(user => (
                  <div 
                    key={user.user_id} 
                    onClick={() => toggleUserSelection(user.user_id)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${selectedUsers.includes(user.user_id) ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'}`}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                      {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <FaUser className="text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedUsers.includes(user.user_id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                      {selectedUsers.includes(user.user_id) && <span className="text-[10px]">✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              {selectedUsers.length > 1 && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Title</label>
                  <input 
                    type="text" 
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    placeholder="E.g. Sales Team, Urgent Issue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={createNewChat}
                disabled={selectedUsers.length === 0 || creatingChat}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                {creatingChat ? 'Creating...' : selectedUsers.length > 1 ? 'Create Group' : 'Start Chat'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
