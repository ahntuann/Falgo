import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';

const cs = classNames.bind(styles);

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userName: '',
        fullName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        avatar: '',
        address: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');

                if (!storedUser) {
                    setError('Không tìm thấy thông tin người dùng trong LocalStorage');
                    setLoading(false);
                    return;
                }

                const userObject = JSON.parse(storedUser);
                console.log('User từ LocalStorage:', userObject);

                if (!userObject.id) {
                    setError('Không tìm thấy userId trong LocalStorage');
                    setLoading(false);
                    return;
                }

                const userId = userObject.id;

                const response = await axios.get(
                    `http://localhost:5180/api/user/profile/${userId}`,
                );

                setUser(response.data);
            } catch (err) {
                setError('Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSave = async () => {
        // Kiểm tra xem có trường nào bị bỏ trống không
        if (
            !user.fullName ||
            !user.email ||
            !user.dateOfBirth ||
            !user.phoneNumber ||
            !user.address
        ) {
            setError('Vui lòng điền đầy đủ thông tin trước khi lưu!');
            return;
        }

        try {
            let userId = user.id;
            if (!userId) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userObject = JSON.parse(storedUser);
                    userId = userObject.id;
                }
            }

            if (!userId) {
                setError('Lỗi: Không tìm thấy ID người dùng!');
                return;
            }

            const updateData = {
                fullName: user.fullName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                phoneNumber: user.phoneNumber,
                address: user.address,
            };

            console.log('Gửi yêu cầu cập nhật cho userId:', userId);

            await axios.put(`http://localhost:5180/api/user/update/${userId}`, updateData);

            if (selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);

                try {
                    const response = await axios.post(
                        `http://localhost:5180/api/user/update-avatar/${userId}`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } },
                    );

                    console.log('Kết quả upload avatar:', response.data);

                    if (response.data.success) {
                        alert('Cập nhật ảnh đại diện thành công!');
                        setUser({ ...user, avatar: response.data.avatarUrl });
                    } else {
                        alert('Không thể cập nhật ảnh đại diện!');
                    }
                } catch (error) {
                    console.error('Lỗi khi upload avatar:', error);
                    alert('Có lỗi xảy ra khi cập nhật ảnh đại diện!');
                }
            } else {
                alert('Cập nhật thông tin thành công!');
            }

            setEditing(false);
            setError(null); // Xóa lỗi khi cập nhật thành công
        } catch (error) {
            setError('Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    if (loading) return <div className={cs('loading')}>Đang tải...</div>;
    if (error) return <div className={cs('error')}>{error}</div>;

    return (
        <div className={cs('profilePage')}>
            <div className={cs('profile-container')}>
                <div className={cs('profile-header')}>
                    <div className={cs('nav-tabs')}>
                        <button className={cs('nav-tab')} onClick={() => navigate('/profile')}>
                            Hồ sơ cá nhân
                        </button>
                        <button className={cs('nav-tab', 'active')}>Chỉnh sửa hồ sơ</button>
                        <button
                            className={cs('nav-tab')}
                            onClick={() => navigate('/userprofileblog')}
                        >
                            Bài viết
                        </button>
                        <button
                            className={cs('nav-tab')}
                            onClick={() => navigate('/usersubmissions')}
                        >
                            Bài nộp
                        </button>
                        <button className={cs('nav-tab')} onClick={() => navigate('/usercontest')}>
                            Cuộc thi
                        </button>
                    </div>
                </div>
                <div className={cs('profile-content')}>
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
                        {editing && (
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        )}
                    </div>
                    <div className={cs('profile-info')}>
                        {[
                            { key: 'userName', label: 'Tên đăng nhập' },
                            { key: 'fullName', label: 'Họ và tên' },
                            { key: 'email', label: 'Email' },
                            { key: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
                            { key: 'phoneNumber', label: 'Số điện thoại' },
                            { key: 'address', label: 'Địa chỉ' },
                        ].map(({ key, label, type }) => (
                            <div key={key} className={cs('info-row')}>
                                <div className={cs('info-label')}>{label}</div>
                                <div className={cs('info-value')}>
                                    {editing ? (
                                        <>
                                            <input
                                                type={type || 'text'}
                                                name={key}
                                                value={user[key] || ''}
                                                onChange={handleInputChange}
                                            />
                                            {!user[key] && (
                                                <div className={cs('error-message')}>
                                                    Không được để trống
                                                </div>
                                            )}
                                        </>
                                    ) : key === 'dateOfBirth' ? (
                                        new Date(user[key]).toLocaleDateString('vi-VN')
                                    ) : (
                                        user[key]
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={cs('profile-actions')}>
                        <button className={cs('edit-button')} onClick={() => setEditing(!editing)}>
                            {editing ? 'Hủy' : 'Chỉnh sửa'}
                        </button>
                        {editing && (
                            <button className={cs('save-button')} onClick={handleSave}>
                                Lưu
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
