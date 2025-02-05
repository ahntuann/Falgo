import classNames from 'classnames/bind';

import style from './SliderBanner.module.scss';

const cs = classNames.bind(style);

function SliderBanner() {
    return <div className={cs('wrapper')}></div>;
}

export default SliderBanner;
