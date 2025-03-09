import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';

const cs = classNames.bind(styles);

const Profile = () => {
    const [user, setUser] = useState({
        userName: '',
        fullName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        createdAt: '',
        totalSubmissions: 0,
        totalSolved: 0,
        avatar: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) {
                setError('User ID không được cung cấp');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                console.log('Đang gọi API với userId:', userId);
                const response = await axios.get(`http://localhost:5180/api/user/profile`, {
                    params: { userId },
                });
                console.log('Kết quả API:', response.data);
                setUser(response.data);
            } catch (err) {
                const errorMessage =
                    err.response && err.response.data
                        ? typeof err.response.data === 'string'
                            ? err.response.data
                            : JSON.stringify(err.response.data)
                        : err.message;
                console.error('Chi tiết lỗi:', errorMessage);
                setError(`Không thể tải thông tin người dùng: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axios.post(`http://localhost:5180/api/user/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: { userId },
            });

            setUser({ ...user, avatar: response.data.avatar });
        } catch (err) {
            console.error('Lỗi khi cập nhật avatar:', err);
        }
    };

    if (loading) {
        return <div className={cs('loading')}>Đang tải...</div>;
    }

    if (error) {
        return <div className={cs('error')}>{error}</div>;
    }

    return (
        <div className={cs('profile-container')}>
            <div className={cs('profile-header')}>
                <div className={cs('nav-tabs')}>
                    <button className={cs('nav-tab', 'active')}>Hồ sơ cá nhân</button>
                    <button className={cs('nav-tab')}>Bài viết</button>
                    <button className={cs('nav-tab')}>Bài nộp</button>
                    <button className={cs('nav-tab')}>Cuộc thi</button>
                </div>
            </div>

            <div className={cs('profile-content')}>
                <div className={cs('profile-info')}>
                    {[
                        'userName',
                        'fullName',
                        'email',
                        'dateOfBirth',
                        'phoneNumber',
                        'createdAt',
                        'totalSubmissions',
                        'totalSolved',
                    ].map((field, index) => (
                        <div key={index} className={cs('info-row')}>
                            <div className={cs('info-label')}>{field}</div>
                            <div className={cs('info-value')}>
                                {field.includes('date') ? formatDate(user[field]) : user[field]}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={cs('profile-avatar')}>
                    <img
                        src={user.avatar || '/default-avatar.png'}
                        alt="Avatar người dùng"
                        className={cs('avatar-image')}
                    />
                    <a
                        href="#"
                        className={cs('change-avatar-link')}
                        onClick={() => document.getElementById('avatar-upload').click()}
                    >
                        Đổi avatar
                    </a>
                    <input
                        type="file"
                        id="avatar-upload"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
