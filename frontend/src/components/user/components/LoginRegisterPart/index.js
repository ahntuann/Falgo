import classNames from 'classnames/bind';

import style from './LoginRegisterPart.module.scss';
import { Link } from 'react-router-dom';

const cs = classNames.bind(style);

function LoginRegisterPart() {
    return (
        <div className={cs('wrapper')}>
            <span className={cs('login')}>
                <Link className={cs('login-link')} to="/login">
                    Login
                </Link>
            </span>
            or
            <span className={cs('login')}>
                <Link className={cs('login-link')} to="/register">
                    Register
                </Link>
            </span>
        </div>
    );
}

export default LoginRegisterPart;
