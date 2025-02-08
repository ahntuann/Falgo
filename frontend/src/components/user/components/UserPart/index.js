import classNames from 'classnames/bind';

import style from './UserPart.module.scss';
import { Link } from 'react-router-dom';

const cs = classNames.bind(style);

function UserPart() {
    return (
        <div className={cs('wrapper')}>
            <Link className={cs('avt')} to={'/profile'}>
                <img
                    alt="avt"
                    className={cs('avtImg')}
                    src="https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg"
                ></img>
            </Link>
        </div>
    );
}

export default UserPart;
