import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import moment from 'moment';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const formik = useFormik({
        initialValues: {
            fullName: '',
            username: '',
            password: '',
            email: '',
            phoneNumber: '',
            address: '',
            dob: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Họ và tên được yêu cầu'),
            username: Yup.string().required('Tên đăng nhập được yêu cầu'),
            password: Yup.string()
                .min(12, 'Phải có ít nhất 12 ký tự')
                .matches(/[0-9]/, 'Phải có ít nhất một số')
                .matches(/[a-z]/, 'Phải có ít nhất một ký tự viết thường')
                .matches(/[A-Z]/, 'Phải có ít nhất một ký tự viết hoa')
                .matches(/[^a-zA-Z0-9]/, 'Phải có ít nhất một ký tự đặc biệt')
                .required('Mật khẩu được yêu cầu'),
            email: Yup.string().email('Invalid email').required('Phải nhập Email'),
            phoneNumber: Yup.string().required('Phải nhập'),
            address: Yup.string().required('Phải nhập'),
            dob: Yup.date().required('Phải nhập').nullable(),
        }),
        onSubmit: async (values) => {
            const formattedDateOfBirth = moment(values.dob).toISOString();
            const requestData = {
                fullName: values.fullName,
                username: values.username,
                password: values.password,
                email: values.email,
                phoneNumber: values.phoneNumber,
                address: values.address,
                DateOfBirth: formattedDateOfBirth,
            };

            try {
                await axios.post('http://localhost:5180/api/account/register', requestData);
                alert('Đăng ký thành công.');
                navigate('/login');
            } catch (error) {
                console.log('Error response:', error.response);
                if (error.response && error.response.data) {
                    if (error.response.data === 'Username/Email is already in use.') {
                        alert('Tên đăng nhập hoặc mật khẩu đã được sử dụng. Hãy nhập lại.');
                    } else {
                        alert(`Đăng ký không thành công: ${error.response.data}`);
                    }
                } else {
                    alert('Đăng ký không thành công! Hãy nhập lại.');
                }
            }
        },
    });

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Tạo tài khoản mới</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Họ và tên"
                            onChange={formik.handleChange}
                            value={formik.values.fullName}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                    </div>
                    <div className="input-group password-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Mật khẩu"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        <span className="eye-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? '🙈' : '👁'}
                        </span>
                    </div>

                    {formik.errors.password && formik.touched.password && (
                        <p className="error-message">{formik.errors.password}</p>
                    )}

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Số điện thoại"
                            onChange={formik.handleChange}
                            value={formik.values.phoneNumber}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="address"
                            placeholder="Địa chỉ"
                            onChange={formik.handleChange}
                            value={formik.values.address}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="date"
                            name="dob"
                            onChange={formik.handleChange}
                            value={formik.values.dob}
                        />
                    </div>
                    <button type="submit" className="register-button">
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
