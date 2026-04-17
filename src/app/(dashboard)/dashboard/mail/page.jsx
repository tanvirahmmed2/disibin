'use client'
import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { RiSearchLine, RiSendPlane2Line, RiUserLine, RiAtLine, RiInformationLine } from 'react-icons/ri'

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

    const fetchChats = async () => {
        try {
            const res = await axios.get('/api/task?mode=conversations')
            setChats(res.data.data)
            if (res.data.data.length > 0 && !activeChatId) {
                setActiveChatId(res.data.data[0]._id)
            }
        } catch (error) {
            console.error('Failed to fetch chats', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userData?._id) fetchChats()
    }, [userData])

    useEffect(() => {
        const activeChat = chats.find(c => c._id === activeChatId)
        if (activeChat) {
            setMessages(activeChat.messages || [])
        }
    }, [activeChatId, chats])

    const sendMessage = async () => {
        if (!inputText.trim() || !activeChatId) return
        
        try {
            const res = await axios.patch('/api/task', {
                id: activeChatId,
                message: inputText
            })
            
            setMessages([...messages, { 
                senderId: userData._id, 
                message: inputText, 
                createdAt: new Date() 
            }])
            setInputText('')
            
            fetchChats()
        } catch (error) {
            alert('Failed to send message')
        }
    }

    const currentChat = chats.find(c => c._id === activeChatId)
    const otherParticipant = currentChat?.participants.find(p => p._id !== userData._id)

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6">
            
            <div className="w-80 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col p-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 mb-6">
                    <RiSearchLine size={18} />
                    <input type="text" className="bg-transparent border-none outline-none text-xs w-full" />
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
                    ) : (
                        chats.map((chat) => {
                            const other = chat.participants.find(p => p._id !== userData._id)
                            return (
                                <ChatItem 
                                    key={chat._id} 
                                    item={{ 
                                        name: other?.name || 'Unknown', 
                                        lastMessage: chat.lastMessage?.message || 'No messages yet',
                                        role: other?.role
                                    }} 
                                    active={activeChatId === chat._id} 
                                    onClick={() => setActiveChatId(chat._id)}
                                />
                            )
                        })
                    )}
                </div>
            </div>

            
            {activeChatId ? (
                <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl uppercase">
                                {otherParticipant?.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{otherParticipant?.name}</h2>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                                    <RiAtLine /> {otherParticipant?.role}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.senderId === userData?._id ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-md p-4 rounded-2xl shadow-sm border
                                    ${msg.senderId === userData?._id ? 'bg-primary text-white border-primary/50 rounded-tr-none' : 'bg-slate-50 text-slate-700 border-slate-100 rounded-tl-none'}`}>
                                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 font-bold">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <input 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                type="text" 
                                className="flex-1 bg-transparent px-3 outline-none text-slate-600" 
                            />
                            <button 
                                onClick={sendMessage}
                                className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                <RiSendPlane2Line size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-center text-slate-400">
                    Select a conversation to start chatting
                </div>
            )}
        </div>
    )
}


export default InternalMail
