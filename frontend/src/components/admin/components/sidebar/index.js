import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem('admin'); // Remove admin data
        navigate('/'); // Redirect to login page or home
    };
    return (
        <div className={cx('sidebar', { collapsed: !isSidebarOpen })}>
            <div>
                <button
                    className={cx('toggleButton')}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? '<<' : '>>'}
                </button>
                <h2 className={cx('sidebarTitle')}>Bảng điều khiển</h2>
                <ul className={cx('menuList')}>
                    <li>
                        <NavLink
                            to="/Dashboard"
                            className={({ isActive }) => cx('menuItem', { active: isActive })}
                        >
                            Bảng thống kê
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/ProblemsManagement"
                            className={({ isActive }) => cx('menuItem', { active: isActive })}
                        >
                            Quản lý bài tập
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/UserManagement"
                            className={({ isActive }) => cx('menuItem', { active: isActive })}
                        >
                            Quản lý người dùng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/BlogManagement"
                            className={({ isActive }) => cx('menuItem', { active: isActive })}
                        >
                            Quản lý bài đăng
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/ContestManagement"
                            className={({ isActive }) => cx('menuItem', { active: isActive })}
                        >
                            Quản lý cuộc thi
                        </NavLink>
                    </li>
                </ul>
            </div>
            <button className={cx('button')} onClick={() => handleLogout()}>
                Logout
            </button>
            <button className={cx('toggleButton')} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? '<<' : '>>'}
            </button>
            <h2 className={cx('sidebarTitle')}>Bảng điều khiển</h2>
            <ul className={cx('menuList')}>
                <li>
                    <NavLink
                        to="/Dashboard"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Bảng thống kê
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/ProblemsManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Quản lý bài tập
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/UserManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Quản lý người dùng
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/BlogManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Quản lý bài đăng
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/BlogCommentManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Quản lý bình luận bài đăng
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/ContestManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Quản lý cuộc thi
                    </NavLink>
                </li>
            </ul>
            <button className={cx('button')} onClick={() => handleLogout()}>
                Logout
            </button>
        </div>
    );
}

export default Sidebar;
