"use client";

import { useState } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

type Message = {
    question: string;
    answer: string;
};

export default function ChatDialog() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: input }),
        });
        const data = await res.json();
        setMessages([...messages, { question: input, answer: data.answer }]);
        setInput('');
    };

    return (
        <LazyMotion features={domAnimation}>
            <>
                {/* Chat Button */}
                <m.button
                    onClick={() => setOpen(!open)}
                    className="fixed bottom-12 right-5 z-50 h-12 w-12 bg-primary text-white rounded-full shadow-lg border border-white hover:bg-primary-dark transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <MessageCircle className="h-6 w-6 mx-auto" />
                </m.button>

                {/* Chat Container */}
                {open && (
                    <m.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-24 right-5 z-40 w-80 h-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center justify-between">
                            <h3 className="text-white font-semibold">المساعد الذكي</h3>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 text-sm flex items-center justify-center h-full">
                                    <div>
                                        <div className="text-2xl mb-2">✨</div>
                                        اسألني أي شيء يخطر في بالك وسأساعدك!
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div key={index} className="space-y-3">
                                        {/* User message */}
                                        <div className="flex justify-end">
                                            <div className="bg-primary text-white text-sm rounded-2xl rounded-br-md px-4 py-2 max-w-xs">
                                                {msg.question}
                                            </div>
                                        </div>

                                        {/* Bot message */}
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                                                {msg.answer}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Field */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="اكتب سؤالك هنا..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') sendMessage();
                                    }}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim()}
                                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </m.div>
                )}
            </>
        </LazyMotion>
    );
}
