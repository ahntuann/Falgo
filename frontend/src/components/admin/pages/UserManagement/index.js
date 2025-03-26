import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '~/layouts';
import classNames from 'classnames/bind';
import styles from './UserManagement.module.scss';

const cs = classNames.bind(styles);

function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortSubmitted, setSortSubmitted] = useState('');
    const [sortSolved, setSortSolved] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5180/api/AdminDashboard/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:5180/api/AdminDashboard/user/${userId}`);
            fetchUsers();
            alert('Xóa người dùng thành công');
        } catch (error) {
            console.error('Xóa người dùng thất bại:', error);
        }
    };

    const handleEdit = (user) => {
        navigate(`/user-update/${user.id}`);
    };

    const sortedUsers = [...users]
        .sort((a, b) => {
            if (sortSubmitted === 'asc') {
                return a.totalSubmissions - b.totalSubmissions;
            } else if (sortSubmitted === 'desc') {
                return b.totalSubmissions - a.totalSubmissions;
            }
            return 0;
        })
        .sort((a, b) => {
            if (sortSolved === 'asc') {
                return a.totalSolved - b.totalSolved;
            } else if (sortSolved === 'desc') {
                return b.totalSolved - a.totalSolved;
            }
            return 0;
        });

    return (
        <AdminLayout>
            <div className={cs('user-management-container')}>
                <h1 className={cs('title')}>Quản lý Người dùng</h1>

                <div className={cs('filters')}>
                    <input
                        className={cs('search-input')}
                        type="text"
                        placeholder="Tìm theo tên người dùng hoặc email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className={cs('filter-select')}
                        value={sortSubmitted}
                        onChange={(e) => setSortSubmitted(e.target.value)}
                    >
                        <option value="">Sắp xếp số bài nộp</option>
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>

                    <select
                        className={cs('filter-select')}
                        value={sortSolved}
                        onChange={(e) => setSortSolved(e.target.value)}
                    >
                        <option value="">Sắp xếp số bài giải đúng</option>
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>

                <table className={cs('table')}>
                    <thead>
                        <tr>
                            <th>Số thứ tự</th>
                            <th>Tên người dùng</th>
                            <th>Email</th>
                            <th>Bài đã nộp</th>
                            <th>Bài đã giải đúng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.totalSubmissions || 0}</td>
                                <td>{user.totalSolved || 0}</td>
                                <td className={cs('action-buttons')}>
                                    <button
                                        className={cs('edit-btn')}
                                        onClick={() => handleEdit(user)}
                                    >
                                        Cập nhật
                                    </button>
                                    <button
                                        className={cs('delete-btn')}
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default UserManagement;
