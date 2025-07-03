"use client";

import { useState } from 'react';
import {
    TextField,
    IconButton,
    Button,
    InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
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
        <>
            {/* Chat Button */}
            <IconButton
                onClick={() => setOpen(!open)}
                className="shadow-md"
                style={{
                    position: 'fixed',
                    bottom: '50px',
                    right: '20px',
                    border:"1px solid #fff",
                    backgroundColor: '#249491',
                    color: 'white',
                    borderRadius: '50%',
                    height: 50,
                    zIndex: 1001,
                }}
                
            >
                <MapsUgcIcon  sx={{
                    fontSize: 30,
                    color: 'white',
                }} />
            </IconButton>

            {/* Chat Container */}
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: 350,
                        height: '60vh',
                        backgroundColor: '#f9f9f9',
                        borderRadius: 16,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1000,
                    }}
                >
                    {/* Header with Image */}
                    <div style={{ padding: 8, backgroundColor: 'primary.main' }}>
                        {/* <Image
                            src="/assets/images/logo.png"
                            alt="Header"
                            width={350}
                            height={60}
                            style={{ borderRadius: 12, objectFit: 'cover', width: '100%' }}
                        /> */}
                    </div>

                    {/* Chat Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {messages.length === 0 ? (
                            <div className='text-secondary-main text-center text-sm' style={{
                                margin: 'auto',
                                textAlign: 'center',
                            //     color: 'secondary.main',
                            //     fontSize: 14,
                            // 
                            }}>
                                ✨ اسألني أي شيء يخطر في بالك وسأساعدك!
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index}>
                                    {/* User message */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                                        <div className='bg-primary-main text-white text-sm rounded-r-lg p-2'
                                            style={{
                                                // background: 'primary.main',
                                                padding: '8px 12px',
                                                borderRadius: '16px 16px 0 16px',
                                                maxWidth: '80%',
                                            }}
                                        >
                                            {msg.question}
                                        </div>
                                    </div>

                                    {/* Bot message */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                                        <div className='bg-secondary-main text-white text-sm rounded-l-lg'
                                            style={{
                                                // background: 'secondary.main',
                                                padding: '8px 12px',
                                                borderRadius: '16px 16px 16px 0',
                                                maxWidth: '80%',
                                            }}
                                        >
                                            {msg.answer}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Field */}
                    <div style={{ padding: '10px' }}>
                        <TextField
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="اكتب سؤالك هنا..."
                            fullWidth
                            size="small"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button onClick={sendMessage}>
                                            <SendIcon />
                                        </Button>
                                    </InputAdornment>
                                ),
                                style: {
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                },
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
