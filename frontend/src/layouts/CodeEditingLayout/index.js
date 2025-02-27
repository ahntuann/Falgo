import classNames from 'classnames/bind';

import style from './CodeEditingLayout.module.scss';
import { NavBar } from '~/components/user/components';

const cs = classNames.bind(style);

function CodeEditingLayout({ children }) {
    return (
        <div className={cs('wrapper')}>
            <NavBar classNames={cs('codeEditingNav')} />

            {children}
        </div>
    );
}

export default CodeEditingLayout;
