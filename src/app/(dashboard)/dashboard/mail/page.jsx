'use client'
import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { RiSearchLine, RiSendPlane2Line, RiUserLine, RiAtLine, RiInformationLine, RiMailSendLine, RiInboxLine } from 'react-icons/ri'

const ChatItem = ({ item, active, onClick }) => (
    <div 
        onClick={onClick}
        className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3
        ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600'}`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
            {item.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
            <div className={`font-bold truncate ${active ? 'text-white' : 'text-slate-800'}`}>{item.name}</div>
            <div className={`text-[10px] truncate ${active ? 'text-white/70' : 'text-slate-400'}`}>{item.lastMessage}</div>
        </div>
        <div className={`text-[9px] ${active ? 'text-white/50' : 'text-slate-300'}`}>12:45</div>
    </div>
)

const InternalMail = () => {
    const { userData } = useContext(Context)
    const [activeChatId, setActiveChatId] = useState(null)
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [inputText, setInputText] = useState('')
    const [showNewMessage, setShowNewMessage] = useState(false)
    const [staffUsers, setStaffUsers] = useState([])
    const [staffLoading, setStaffLoading] = useState(false)

    const fetchChats = React.useCallback(async () => {
        try {
            const res = await axios.get('/api/messages')
            setChats(res.data.data)
            if (res.data.data.length > 0 && !activeChatId) {
                setActiveChatId(res.data.data[0].conversation_id)
            }
        } catch (error) {
            console.error('Failed to fetch chats', error)
        } finally {
            setLoading(false)
        }
    }, [activeChatId])

    const fetchMessages = React.useCallback(async (convId) => {
        try {
            const res = await axios.get(`/api/messages?conversationId=${convId}`)
            setMessages(res.data.data)
        } catch (error) {
            console.error('Failed to fetch messages', error)
        }
    }, [])

    const fetchStaff = React.useCallback(async () => {
        setStaffLoading(true)
        try {
            const res = await axios.get('/api/messages/conversations')
            setStaffUsers(res.data.data)
        } catch (error) {
            console.error('Failed to fetch staff', error)
        } finally {
            setStaffLoading(false)
        }
    }, [])

    const handleStartChat = async (targetUser) => {
        try {
            const res = await axios.post('/api/messages', {
                receiverId: targetUser.user_id,
                message: `Hi ${targetUser.name}, I'd like to start a discussion regarding the current projects.`
            })
            setShowNewMessage(false)
            fetchChats()
            setActiveChatId(res.data.data.conversation_id)
        } catch (error) {
            alert('Failed to start conversation')
        }
    }

    useEffect(() => {
        if (userData?.user_id) fetchChats()
    }, [userData?.user_id, fetchChats])

    useEffect(() => {
        if (showNewMessage) fetchStaff()
    }, [showNewMessage, fetchStaff])

    useEffect(() => {
        if (activeChatId) {
            fetchMessages(activeChatId)
            const interval = setInterval(() => fetchMessages(activeChatId), 5000)
            return () => clearInterval(interval)
        }
    }, [activeChatId, fetchMessages])

    const sendMessage = async () => {
        if (!inputText.trim() || !activeChatId) return
        
        try {
            await axios.post('/api/messages', {
                conversationId: activeChatId,
                message: inputText
            })
            
            setInputText('')
            fetchMessages(activeChatId)
        } catch (error) {
            alert('Failed to send message')
        }
    }

    const currentChat = chats.find(c => c.conversation_id === activeChatId)

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6 overflow-hidden">
            
            <div className="w-80 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-6 px-3">
                    <h2 className="text-xl font-black text-slate-800 tracking-tighter">Inbox</h2>
                    <button 
                        onClick={() => setShowNewMessage(!showNewMessage)}
                        className={`p-3 rounded-2xl transition-all shadow-lg ${showNewMessage ? 'bg-slate-800 text-white shadow-slate-200' : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'}`}
                    >
                        {showNewMessage ? <RiInformationLine size={20} /> : <RiSendPlane2Line size={20} />}
                    </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 mb-6 transition-all focus-within:bg-white focus-within:shadow-inner">
                    <input type="text" placeholder="Search interactions..." className="input-standard !py-2 !pl-10" />
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                    {showNewMessage ? (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] px-3 mb-4">Start New Chat</p>
                            {staffLoading ? (
                                <div className="p-12 text-center">
                                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Staff...</p>
                                </div>
                            ) : staffUsers.map(user => (
                                <div 
                                    key={user.user_id}
                                    onClick={() => handleStartChat(user)}
                                    className="p-4 rounded-2xl hover:bg-emerald-50/50 cursor-pointer flex items-center gap-4 transition-all group border border-transparent hover:border-emerald-100"
                                >
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-sm uppercase group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-slate-800 truncate group-hover:text-emerald-700">{user.name}</div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">{user.role}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : loading ? (
                        <div className="p-12 text-center text-slate-300">
                            <RiInboxLine size={32} className="mx-auto mb-4 opacity-20" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Fetching Conversations...</p>
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <ChatItem 
                                key={chat.conversation_id} 
                                item={{ 
                                    name: chat.title || 'Internal Thread', 
                                    lastMessage: chat.last_message || 'Waiting for first message...',
                                }} 
                                active={activeChatId === chat.conversation_id} 
                                onClick={() => setActiveChatId(chat.conversation_id)}
                            />
                        ))
                    )}
                </div>
            </div>

            
            {activeChatId ? (
                <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-2xl uppercase shadow-sm">
                                {currentChat?.title?.charAt(0) || 'C'}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tighter leading-none mb-1">{currentChat?.title || 'Conversation'}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-80">Encryption Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-slate-50/20">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-200 gap-6">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-premium ring-8 ring-slate-50">
                                    <RiMailSendLine size={32} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Quiet in here...</p>
                            </div>
                        ) : messages.map((msg, index) => {
                            const isMe = String(msg.sender_id) === String(userData?.user_id);
                            return (
                                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                                    {!isMe && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                                        <RiUserLine className="text-emerald-500" /> {msg.sender_name}
                                    </span>}
                                    <div className={`max-w-[75%] p-5 rounded-3xl shadow-sm border transition-all duration-300
                                        ${isMe 
                                            ? 'bg-primary text-white border-primary shadow-emerald-100 rounded-tr-none hover:shadow-emerald-200' 
                                            : 'bg-white text-slate-700 border-slate-100 rounded-tl-none hover:border-emerald-100 hover:shadow-md'}`}>
                                        <p className="text-[13px] font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <span className="text-[8px] text-slate-400 mt-2 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Delivered at {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-8 border-t border-slate-50 bg-white">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 shadow-inner p-3 flex items-center gap-3 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-500">
                            <input 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                type="text" 
                                placeholder="Write a message..."
                                className="input-standard !py-2" 
                            />
                            <button 
                                onClick={sendMessage}
                                className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all group"
                            >
                                <RiSendPlane2Line size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col items-center justify-center text-center p-20 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="w-32 h-32 bg-gradient-to-tr from-emerald-50 to-white text-emerald-500 rounded-[3rem] flex items-center justify-center mb-8 shadow-premium ring-1 ring-emerald-100/50">
                        <RiMailSendLine size={56} className="animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">Unified Communications</h3>
                    <p className="text-slate-400 text-base max-w-sm font-medium leading-relaxed opacity-80">
                        Connect with your team instantly. Select a thread or start a new high-security conversation with our staff.
                    </p>
                    <button 
                        onClick={() => setShowNewMessage(true)}
                        className="mt-8 px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                    >
                        Open Directory
                    </button>
                </div>
            )}
        </div>
    )
}


export default InternalMail
