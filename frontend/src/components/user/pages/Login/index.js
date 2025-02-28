import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import './Login.css';
import AuthContext from '~/context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { logInAsUser } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Tên đăng nhập được yêu cầu'),
            password: Yup.string()
                .min(12, 'Phải có ít nhất 12 ký tự')
                .matches(/[0-9]/, 'Phải có ít nhất một số')
                .matches(/[a-z]/, 'Phải có ít nhất một ký tự viết thường')
                .matches(/[A-Z]/, 'Phải có ít nhất một ký tự viết hoa')
                .matches(/[^a-zA-Z0-9]/, 'Phải có ít nhất một ký tự đặc biệt')
                .required('Mật khẩu được yêu cầu'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(
                    'http://localhost:5180/api/account/login',
                    values,
                );

                console.log('API Response:', response.data);

                const userId = response.data?.id;

                if (!userId) {
                    throw new Error('User ID not found in response data');
                }

                const user = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                logInAsUser();
                navigate('/');
            } catch (error) {
                console.error('Login failed:', error.response?.data || error.message);
                alert('Đăng nhập không thành công! Tên đăng nhập hoặc mật khẩu không chính xác');
            }
        },
    });

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5180/api/account/google-login';
    };

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:5180/api/account/github-login';
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            required
                        />
                        {formik.errors.username && (
                            <div className="error-message">{formik.errors.username}</div>
                        )}
                    </div>

                    <div className="input-group password-group">
                        <label htmlFor="password" id="mat">
                            Mật khẩu
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            required
                        />
                        <span className="eye-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? '🙈' : '👁'}
                        </span>
                        {formik.errors.password && (
                            <div className="error-message">{formik.errors.password}</div>
                        )}
                    </div>

                    <div className="form-links">
                        <Link to="/register" className="create-account-link">
                            Tạo tài khoản mới
                        </Link>
                        <Link to="/reset-password" className="forgot-password-link">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <button type="submit" className="login-button">
                        Đăng nhập
                    </button>

                    <button
                        type="button"
                        className="google-login-button"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle className="google-icon" /> Google
                    </button>

                    <button
                        type="button"
                        className="github-login-button"
                        onClick={handleGithubLogin}
                    >
                        <FaGithub className="github-icon" /> GitHub
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
