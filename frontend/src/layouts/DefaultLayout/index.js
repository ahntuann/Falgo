import classNames from 'classnames/bind';

import style from './DefaultLayout.module.scss';

const cs = classNames.bind(style);

function DefaultLayout({ children }) {
    return <div className={cs('')}>{children}</div>;
}

export default DefaultLayout;
