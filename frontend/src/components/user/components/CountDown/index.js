import classNames from 'classnames/bind';

import style from './CountDown.module.scss';
import { useCallback, useEffect, useState } from 'react';

const cs = classNames.bind(style);

function CountDown({ classNames, endDate }) {
    const countDown = useCallback(() => {
        let difference = new Date(endDate) - new Date();

        console.log(endDate);

        if (difference > 0) {
            const day = Math.floor(difference / (1000 * 60 * 60 * 24));
            difference -= day * 1000 * 60 * 60 * 24;
            const hour = Math.floor(difference / (1000 * 60 * 60));
            difference -= hour * 1000 * 60 * 60;
            const minute = Math.floor(difference / (1000 * 60));
            difference -= minute * 1000 * 60;
            const second = Math.floor(difference / 1000);

            return { day, hour, minute, second };
        }
        return null;
    }, [endDate]);

    const [timeLeft, setTimeLeft] = useState(countDown());

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = countDown();

            if (newTimeLeft === null) clearInterval(interval);

            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [endDate, countDown]);

    return (
        <div className={cs('wrapper', classNames)}>
            Kết thúc sau
            <span className={cs('endDateNum')}>{timeLeft?.day}</span>ngày :
            <span className={cs('endDateNum')}>{timeLeft?.hour}</span>giờ :
            <span className={cs('endDateNum')}>{timeLeft?.minute}</span>phút :
            <span className={cs('endDateNum')}>{timeLeft?.second}</span>giây
        </div>
    );
}

export default CountDown;
