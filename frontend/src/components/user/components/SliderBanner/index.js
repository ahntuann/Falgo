import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './SliderBanner.module.scss';

const cs = classNames.bind(style);

function SliderBanner({ sliders }) {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

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
                        src={slider.banner}
                        alt="slider"
                        onClick={() => navigate(`/contest/detail?id=${slider.id}`)}
                        style={{ cursor: 'pointer' }} // Biến con trỏ thành tay khi hover
                    />
                ))}
            </div>
        </div>
    );
}

export default SliderBanner;
