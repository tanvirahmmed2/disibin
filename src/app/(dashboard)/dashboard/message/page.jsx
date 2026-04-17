'use client'
import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { useRouter } from 'next/navigation'
import { 
    RiSendPlane2Line, 
    RiAttachment2, 
    RiUser3Line, 
    RiSearchLine,
    RiArrowLeftLine,
    RiCircleFill
} from 'react-icons/ri'

const ChatPage = () => {
    const { userData, isLoggedin } = useContext(Context)
    const router = useRouter()
    
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [chatLoading, setChatLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    
    const messagesEndRef = useRef(null)

    
    useEffect(() => {
        if (isLoggedin && userData?.role === 'client') {
            router.replace('/dashboard')
        }
    }, [userData, isLoggedin, router])

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`/api/messages/conversations?currentUserId=${userData?._id}`)
            setUsers(res.data.data)
        } catch (error) {
            console.error('Failed to fetch users', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (receiverId) => {
        setChatLoading(true)
        try {
            const res = await axios.get(`/api/messages?senderId=${userData?._id}&receiverId=${receiverId}`)
            setMessages(res.data.data)
        } catch (error) {
            console.error('Failed to fetch messages', error)
        } finally {
            setChatLoading(false)
        }
    }

    useEffect(() => {
        if (userData?._id) {
            fetchUsers()
        }
    }, [userData])

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id)
            
            
            const interval = setInterval(() => {
                fetchMessages(selectedUser._id)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [selectedUser])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedUser) return

        const msgData = {
            senderId: userData._id,
            receiverId: selectedUser._id,
            message: newMessage,
            attachments: []
        }

        try {
            const res = await axios.post('/api/messages', msgData)
            setMessages([...messages, res.data.data])
            setNewMessage('')
        } catch (error) {
            console.error('Failed to send message', error)
        }
    }

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) return (
        <div className="h-[70vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                
                
                <div className={`w-full md:w-80 flex-shrink-0 border-r border-slate-100 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
                        <div className="relative">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search colleagues..." 
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {filteredUsers.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No users found</div>
                        ) : (
                            filteredUsers.map(user => (
                                <button 
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full p-4 flex items-center gap-3 transition-all border-b border-slate-50 hover:bg-slate-50
                                        ${selectedUser?._id === user._id ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <RiUser3Line size={20} />
                                        </div>
                                        <RiCircleFill className={`absolute bottom-0 right-0 text-xs ${user.isActive ? 'text-green-500' : 'text-slate-300'}`} />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
                                        <p className="text-xs text-slate-400 uppercase font-black tracking-wider">{user.role.replace('_', ' ')}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                
                <div className={`flex-1 flex flex-col bg-[#FDFDFF] ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            
                            <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
                                        <RiArrowLeftLine size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{selectedUser.name}</h3>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <RiCircleFill size={8} /> Online
                                        </p>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                                {chatLoading && messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-400">Loading chat...</div>
                                ) : messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <RiSendPlane2Line size={40} className="opacity-20" />
                                        <p>No messages yet. Say hello!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div 
                                            key={msg._id || index}
                                            className={`flex ${msg.senderId === userData._id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl text-sm
                                                ${msg.senderId === userData._id 
                                                    ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' 
                                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'}`}
                                            >
                                                <p className="leading-relaxed">{msg.message}</p>
                                                <p className={`text-[10px] mt-2 opacity-60 ${msg.senderId === userData._id ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            
                            <div className="p-4 md:p-6 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                    <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                                        <RiAttachment2 size={24} />
                                    </button>
                                    <input 
                                        type="text" 
                                        placeholder="Type your message..." 
                                        className="flex-1 py-3 px-5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        <RiSendPlane2Line size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                <RiMessage2Line size={40} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-slate-800">Your Conversations</h3>
                                <p className="text-sm">Select a colleague to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

import { RiMessage2Line } from 'react-icons/ri'

export default ChatPage
