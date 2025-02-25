import classNames from 'classnames/bind';

import style from './DefaultLayout.module.scss';
import { Footer, NavBar } from '~/components/user/components';

const cs = classNames.bind(style);

function DefaultLayout({ children }) {
    return (
        <div className={cs('wrapper')}>
            <NavBar />

            <div className={cs('children')}>{children}</div>

            <Footer />
        </div>
    );
}

export default DefaultLayout;
