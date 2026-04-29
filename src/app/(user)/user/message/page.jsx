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
    RiCircleFill,
    RiMessage2Line
} from 'react-icons/ri'

const ChatPage = () => {
    const { userData } = useContext(Context)
    const router = useRouter()
    
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [chatLoading, setChatLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    
    const messagesEndRef = useRef(null)

    const fetchUsers = React.useCallback(async () => {
        try {
            const res = await axios.get(`/api/messages/conversations?currentUserId=${userData?.user_id}`)
            setUsers(res.data.data)
        } catch (error) {
            console.error('Failed to fetch users', error)
        } finally {
            setLoading(false)
        }
    }, [userData?.user_id])

    const fetchMessages = React.useCallback(async (receiverId) => {
        setChatLoading(true)
        try {
            const res = await axios.get(`/api/messages?senderId=${userData?.user_id}&receiverId=${receiverId}`)
            setMessages(res.data.data)
        } catch (error) {
            console.error('Failed to fetch messages', error)
        } finally {
            setChatLoading(false)
        }
    }, [userData?.user_id])

    useEffect(() => {
        if (userData?.user_id) {
            fetchUsers()
        }
    }, [userData?.user_id, fetchUsers])

    useEffect(() => {
        if (selectedUser) {
            const userId = selectedUser.user_id || selectedUser.id
            fetchMessages(userId)
            const interval = setInterval(() => {
                fetchMessages(userId)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [selectedUser, fetchMessages])

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
            senderId: userData.user_id,
            receiverId: selectedUser.user_id,
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
        <div className="h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                

                <div className={`w-full md:w-80 flex-shrink-0 border-r border-slate-100 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
                        <div className="relative">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="input-standard pl-10 !py-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {filteredUsers.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">No contacts</div>
                        ) : (
                            filteredUsers.map(user => (
                                <button 
                                    key={user.user_id || user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full px-6 py-4 flex items-center gap-3 border-b border-slate-50 transition-all
                                        ${(selectedUser?.user_id || selectedUser?.id) === (user.user_id || user.id) ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                                            ${(selectedUser?.user_id || selectedUser?.id) === (user.user_id || user.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${user.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.role}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>


                <div className={`flex-1 flex flex-col bg-white ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <>

                            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 text-slate-500">
                                        <RiArrowLeftLine size={20} />
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{selectedUser.name}</h3>
                                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                                    </div>
                                </div>
                            </div>


                            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30">
                                {chatLoading && messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>
                                ) : messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                        <RiMessage2Line size={40} className="opacity-20" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Start the conversation</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div 
                                            key={msg.message_id || msg.id || index}
                                            className={`flex flex-col ${msg.senderId === userData.user_id ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed
                                                ${msg.senderId === userData.user_id 
                                                    ? 'bg-emerald-500 text-white rounded-tr-none' 
                                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'}`}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-2 font-medium">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>


                            <div className="p-4 border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                    <button type="button" className="p-2 text-slate-300 hover:text-emerald-500 transition-all">
                                        <RiAttachment2 size={24} />
                                    </button>
                                    <input 
                                        type="text" 
                                        placeholder="Type message..." 
                                        className="input-standard !py-2"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        <RiSendPlane2Line size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
                            <RiMessage2Line size={40} className="opacity-10" />
                            <p className="text-sm font-bold uppercase tracking-widest">Select a conversation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatPage
