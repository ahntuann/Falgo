import classNames from 'classnames/bind';

import style from './Home.module.scss';
import slider1 from '~/assets/images/slider/slider1.png';
import slider2 from '~/assets/images/slider/slider2.png';
import slider3 from '~/assets/images/slider/slider3.png';

const cs = classNames.bind(style);

function Home() {
    return (
        <div className={cs('wrapper')}>
            <div className={cs('slider')}></div>
        </div>
    );
}

export default Home;
