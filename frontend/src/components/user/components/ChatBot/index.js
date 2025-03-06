import React, { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { GoogleGenerativeAI } from '@google/generative-ai';

import style from './ChatBot.module.scss';

const cs = classNames.bind(style);

const genAI = new GoogleGenerativeAI('AIzaSyAQKlODg9pioCIZ1gBy9KwoQyG4KDaIVpg');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' },
    ]);
    const [input, setInput] = useState('');

    const inputRef = useRef(null);

    const openChat = () => {
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        inputRef.current?.focus();

        try {
            const result = await model.generateContent(input);
            const responseText =
                result.response.candidates[0]?.content?.parts[0]?.text || 'Xin lỗi, tôi chưa hiểu.';

            const botMessage = { sender: 'bot', text: responseText };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: 'Có lỗi xảy ra, vui lòng thử lại!' },
            ]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }

        if (e.key === 'Escape') {
            closeChat();
        }
    };

    return (
        <div className={cs('chatbotContainer')}>
            {isOpen && (
                <div className={cs('chatbox')}>
                    <div className={cs('chatHeader')}>
                        <span>Chatbot</span>
                        <button className={cs('chatboxClose')} onClick={closeChat}>
                            ×
                        </button>
                    </div>
                    <div className={cs('chatBody')}>
                        {messages.map((msg, index) => (
                            <div key={index} className={cs(`chatMessage`, msg.sender)}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className={cs('chatFooter')}>
                        <input
                            type="text"
                            value={input}
                            ref={inputRef}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSendMessage}>Gửi</button>
                    </div>
                </div>
            )}
            {!isOpen && (
                <button className={cs('chatbotButton')} onClick={openChat}>
                    💬
                </button>
            )}
        </div>
    );
};

export default Chatbot;
