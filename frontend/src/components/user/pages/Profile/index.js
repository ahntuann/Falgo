import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useNavigate } from 'react-router-dom';
import logo from '~/assets/images/logo/logo.png';
const cs = classNames.bind(styles);

const Profile = () => {
    const navigate = useNavigate();
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
        address: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);

                // Lấy user từ LocalStorage
                const user = localStorage.getItem('user');
                if (!user) {
                    setError('User không tồn tại trong LocalStorage');
                    setLoading(false);
                    return;
                }

                // Chuyển từ JSON string thành object
                const userObject = JSON.parse(user);
                const userId = userObject.id;

                console.log('Đang gọi API với userId:', userId);

                // Gọi API với userId lấy từ LocalStorage
                const response = await axios.get(
                    `http://localhost:5180/api/user/profile/${userId}`,
                );

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
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <div className={cs('loading')}>Đang tải...</div>;
    }

    if (error) {
        return <div className={cs('error')}>{error}</div>;
    }

    return (
        <div className={cs('profilePage')}>
            <div className={cs('profile-container')}>
                <div className={cs('profile-header')}>
                    <div className={cs('nav-tabs')}>
                        <button className={cs('nav-tab', 'active')}>Hồ sơ cá nhân</button>
                        <button
                            className={cs('nav-tab')}
                            onClick={() => navigate('/updateprofile')}
                        >
                            Chỉnh sửa hồ sơ
                        </button>
                        <button
                            className={cs('nav-tab')}
                            onClick={() => navigate('/userprofileblog')}
                        >
                            Bài viết
                        </button>
                        <button className={cs('nav-tab')}>Bài nộp</button>
                        <button className={cs('nav-tab')}>Cuộc thi</button>
                    </div>
                </div>

                <div className={cs('profile-content')}>
                    <div className={cs('profile-info')}>
                        {[
                            { key: 'userName', label: 'Tên đăng nhập' },
                            { key: 'fullName', label: 'Họ và tên' },
                            { key: 'email', label: 'Email' },
                            { key: 'dateOfBirth', label: 'Ngày sinh' },
                            { key: 'phoneNumber', label: 'Số điện thoại' },
                            { key: 'address', label: 'Địa chỉ' },
                            { key: 'createdAt', label: 'Ngày tham gia' },
                            { key: 'totalSubmissions', label: 'Tổng bài nộp' },
                            { key: 'totalSolved', label: 'Số bài đã giải' },
                        ].map(({ key, label }, index) => (
                            <div key={index} className={cs('info-row')}>
                                <div className={cs('info-label')}>{label}</div>
                                <div className={cs('info-value')}>
                                    {key === 'createdAt' || key === 'dateOfBirth'
                                        ? formatDate(user[key])
                                        : user[key]}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={cs('profile-avatar')}>
                        <img
                            src={
                                user.avatar
                                    ? `http://localhost:5180${user.avatar}`
                                    : 'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg'
                            }
                            alt="Avatar người dùng"
                            className={cs('avatar-image')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
