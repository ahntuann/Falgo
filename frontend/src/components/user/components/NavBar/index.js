import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import style from './NavBar.module.scss';
import logo from '~/assets/images/logo/logo.jpg';
import { useContext } from 'react';
import AuthContext from '~/context/AuthContext';
import { LoginRegisterPart, UserPart } from '~/components/user/components';

const cs = classNames.bind(style);

function NavBar() {
    const navBarList = [
        { title: 'Problems', path: '/problems' },
        { title: 'Contest', path: '/contest' },
        { title: 'Ranking', path: '/ranking' },
        { title: 'Blog', path: '/blog' },
        { title: 'Profile', path: '/profile' },
    ];

    const { userRole } = useContext(AuthContext);

    return (
        <div className={cs('wrapper')}>
            <Link to="/" className={cs('logo')}>
                <img className={cs('logo-img')} src={logo} alt="Logo"></img>
            </Link>

            <div className={cs('navBarItems')}>
                {navBarList.map((item, index) => (
                    <Link className={cs('navBarItem')} to={item.path} key={index}>
                        {item.title}
                    </Link>
                ))}
            </div>

            <div className={cs('userPart')}>{userRole === 'guest' ? <LoginRegisterPart /> : <UserPart />}</div>
        </div>
    );
}

export default NavBar;
