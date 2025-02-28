import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const savedTime = localStorage.getItem('otpExpireTime');
        if (savedTime) {
            const timeLeft = Math.floor((parseInt(savedTime) - Date.now()) / 1000);
            if (timeLeft > 0) setCountdown(timeLeft);
        }
    }, []);

    const sendOtp = async () => {
        await axios.post('http://localhost:5180/api/account/send-verification-code', {
            username,
            email,
        });
        localStorage.setItem('otpExpireTime', Date.now() + 90000);
        setCountdown(90);
    };

    return (
        <div>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <button onClick={sendOtp} disabled={countdown > 0}>
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi mã xác nhận'}
            </button>
        </div>
    );
};

export default ResetPassword;
