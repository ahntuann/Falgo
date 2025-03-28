import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

import style from './NavBar.module.scss';
import logo from '~/assets/images/logo/logo.png';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '~/context/AuthContext';
import { LoginRegisterPart, UserPart } from '~/components/user/components';
import TippyHeadless from '~/components/user/components/TippyHeadless';

const cs = classNames.bind(style);

function NavBar({ classNames }) {
    const navBarList = [
        { title: 'Bài tập', path: '/problems' },
        { title: 'Cuộc thi', path: '/contest' },
        { title: 'Xếp hạng', path: '/ranking' },
        { title: 'Chia sẻ', path: '/blog' },
        { title: 'Trang cá nhân', path: '/profile' },
    ];

    const { logout } = useContext(AuthContext);

    const location = useLocation();

    const [focusOn, setFocusOn] = useState(location.pathname);

    useEffect(() => {
        setFocusOn(location.pathname);
    }, [location.pathname]);

    const { userRole } = useContext(AuthContext);

    return (
        <div className={cs('wrapper', classNames)}>
            <Link to="/" className={cs('logo')}>
                <img className={cs('logo-img')} src={logo} alt="Logo"></img>
            </Link>

            <div className={cs('navBarItems')}>
                {navBarList.map((item, index) => (
                    <Link
                        className={cs('navBarItem', {
                            active:
                                (item.title === 'Bài tập' && '/problems' === focusOn) ||
                                (item.title === 'Cuộc thi' && '/contest' === focusOn) ||
                                (item.title === 'Xếp hạng' && '/ranking' === focusOn) ||
                                (item.title === 'Chia sẻ' && '/blog' === focusOn) ||
                                (item.title === 'Trang cá nhân' && '/profile' === focusOn),
                        })}
                        to={item.path}
                        key={index}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>

            <div className={cs('userPart')}>
                {userRole === 'guest' ? (
                    <LoginRegisterPart />
                ) : (
                    <TippyHeadless
                        onClick={logout}
                        customClass={cs('tippy')}
                        content="Đăng xuất"
                        placement="bottom"
                    >
                        <div>
                            <UserPart />
                        </div>
                    </TippyHeadless>
                )}
            </div>
        </div>
    );
}

export default NavBar;
