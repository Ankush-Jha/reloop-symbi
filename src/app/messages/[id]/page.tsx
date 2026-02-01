'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { ChatMessage, Message } from '@/types';

export default function ChatPage() {
    const params = useParams();
    const contactId = params.id as string;
    const [messages, setChatMessages] = useState<ChatMessage[]>([]);
    const [contact, setContact] = useState<Message | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const allMessages = DemoManager.getMockMessages();
        const found = allMessages.find(m => m.senderId === contactId);
        if (found) setContact(found);
        setChatMessages(DemoManager.getConversation(contactId));
        DemoManager.markConversationRead(contactId);
    }, [contactId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const msg: ChatMessage = {
            id: `chat-${Date.now()}`,
            senderId: 'demo-user-123',
            text: newMessage.trim(),
            timestamp: new Date(),
            isOwn: true,
        };
        DemoManager.addMessage(contactId, msg);
        setChatMessages(prev => [...prev, msg]);
        setNewMessage('');

        // Simulate reply
        setTimeout(() => {
            const replies = [
                'Sounds good! Let me know if you have any questions.',
                'Great, I\'ll be around campus today!',
                'Sure thing! When works for you?',
                'Awesome, looking forward to it!',
            ];
            const reply: ChatMessage = {
                id: `chat-${Date.now() + 1}`,
                senderId: contactId,
                text: replies[Math.floor(Math.random() * replies.length)],
                timestamp: new Date(),
                isOwn: false,
            };
            DemoManager.addMessage(contactId, reply);
            setChatMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg sticky top-0 z-20">
                <Link
                    href="/messages"
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm shrink-0"
                >
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </Link>
                {contact && (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full border-2 border-dark dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                            <img src={contact.senderAvatar} alt={contact.senderName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-dark dark:text-white truncate">{contact.senderName}</p>
                            {contact.listingTitle && (
                                <p className="text-xs text-primary font-bold truncate">{contact.listingTitle}</p>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium ${msg.isOwn
                                ? 'bg-primary text-dark rounded-br-md border-2 border-dark dark:border-gray-600'
                                : 'bg-white dark:bg-dark-surface text-dark dark:text-white rounded-bl-md border-2 border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <p>{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.isOwn ? 'text-dark/50 dark:text-white/50' : 'text-dark/40 dark:text-white/40'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-t-2 border-gray-100 dark:border-gray-700 sticky bottom-0">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 h-12 rounded-full bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 px-5 font-medium placeholder:text-gray-400 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-primary rounded-full border-2 border-dark dark:border-gray-600 flex items-center justify-center shadow-brutal-sm disabled:opacity-50 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-dark dark:text-white">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
