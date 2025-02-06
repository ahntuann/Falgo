import classNames from 'classnames/bind';

import style from './SliderBanner.module.scss';
import { useEffect, useState } from 'react';

const cs = classNames.bind(style);

function SliderBanner({ sliders }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % sliders.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [sliders.length]);

    return (
        <div className={cs('wrapper')}>
            <div
                className={cs('sliderContainer')}
                style={{
                    transform: `translateX(-${index * 100}%)`,
                }}
            >
                {sliders.map((slider, i) => (
                    <img
                        key={i}
                        className={cs('sliderImg', {
                            active: i === index,
                        })}
                        src={slider}
                        alt="slider"
                    />
                ))}
            </div>
        </div>
    );
}

export default SliderBanner;
