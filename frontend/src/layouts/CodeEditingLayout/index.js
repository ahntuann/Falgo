import classNames from 'classnames/bind';

import style from './CodeEditingLayout.module.scss';

const cs = classNames.bind(style);

function CodeEditingLayout({ children }) {
    return <div className={cs('wrapper')}>{children}</div>;
}

export default CodeEditingLayout;
