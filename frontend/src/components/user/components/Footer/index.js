import classNames from 'classnames/bind';

import style from './Footer.module.scss';

const cs = classNames.bind(style);

function Footer() {
    return (
        <div className={cs('wrapper')}>
            <div className={cs('content')}>
                <div>Cung cấp bởi đội ngũ Falgo</div>

                <div>2025</div>
            </div>
        </div>
    );
}

export default Footer;
