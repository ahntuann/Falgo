import classNames from 'classnames/bind';

import style from './UserPart.module.scss';

const cs = classNames.bind(style);

function UserPart() {
    return <div className={cs('wrapper')}></div>;
}

export default UserPart;
