import { useState, useEffect } from 'react';

const useCountdown = (startDate, dueTimeMinutes, onComplete) => {
    const calculateRemainingTime = () => {
        const endTime = new Date(new Date(startDate).getTime() + dueTimeMinutes * 60000);
        const now = new Date();
        const diff = Math.max(0, endTime - now);

        return {
            minutes: Math.floor(diff / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
            // isTimeUp: diff === 0,
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateRemainingTime());

    useEffect(() => {
        // if (timeLeft.isTimeUp) {
        //     if (onComplete) onComplete();
        //     return;
        // }

        const timer = setInterval(() => {
            setTimeLeft(calculateRemainingTime());
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate, dueTimeMinutes, timeLeft.isTimeUp]);

    return timeLeft;
};

export default useCountdown;
