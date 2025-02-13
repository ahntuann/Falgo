import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className={cx('sidebar', { collapsed: !isSidebarOpen })}>
            <button className={cx('toggleButton')} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? '<<' : '>>'}
            </button>
            <h2 className={cx('sidebarTitle')}>Admin Panel</h2>
            <ul className={cx('menuList')}>
                <li>
                    <NavLink
                        to="/Dashboard"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/ProblemsManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Problems Management
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/UserManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        Users Management
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/BlogManagement"
                        className={({ isActive }) => cx('menuItem', { active: isActive })}
                    >
                        BlogManagement
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
