import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminLayout } from '~/layouts';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UpdateUserByAdmin.module.scss';

const cs = classNames.bind(styles);

const UpdateUserByAdmin = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        address: '',
        avatar: '',
    });
    const role = JSON.parse(sessionStorage.getItem('admin'));
    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
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
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSave = async () => {
        if (
            !user.fullName ||
            !user.email ||
            !user.dateOfBirth ||
            !user.phoneNumber ||
            !user.address
        ) {
            alert('Vui lòng điền đầy đủ thông tin trước khi lưu!');
            return;
        }

        try {
            const updateData = {
                fullName: user.fullName,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                phoneNumber: user.phoneNumber,
                address: user.address,
            };

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
                    setUser({ ...user, avatar: response.data.avatarUrl });
                } catch (error) {
                    alert('Có lỗi xảy ra khi cập nhật ảnh đại diện!');
                }
            }

            alert('Cập nhật thông tin thành công!');
            navigate('/usermanagement');
        } catch (error) {
            setError('Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    if (loading) return <div className={cs('loading')}>Đang tải...</div>;
    if (error) return <div className={cs('error')}>{error}</div>;

    return (
        <AdminLayout>
            <div className={cs('profilePage')}>
                <div className={cs('profile-container')}>
                    <div className={cs('profile-content')}>
                        <div className={cs('profile-info')}>
                            {[
                                { key: 'fullName', label: 'Họ và tên' },
                                { key: 'email', label: 'Email' },
                                { key: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
                                { key: 'phoneNumber', label: 'Số điện thoại' },
                                { key: 'address', label: 'Địa chỉ' },
                            ].map(({ key, label, type }) => (
                                <div key={key} className={cs('info-row')}>
                                    <div className={cs('info-label')}>{label}</div>
                                    <input
                                        type={type || 'text'}
                                        name={key}
                                        value={user[key] || ''}
                                        onChange={handleInputChange}
                                    />
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
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                    <button className={cs('save-button')} onClick={handleSave}>
                        Cập nhật
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UpdateUserByAdmin;
