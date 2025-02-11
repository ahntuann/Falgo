import React, { useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import AuthContext from '~/context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { logInAsUser } = useContext(AuthContext);
    const location = useLocation();
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
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
                alert(`Login failed! ${error.response?.data || error.message}`);
            }
        },
    });

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5180/api/account/google-login';
    };

    const checkGoogleAuth = async () => {
        try {
            console.log('Fetching Google login response...');
            const response = await fetch('http://localhost:5180/api/account/signin-google', {
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Google login failed');

            const data = await response.json();
            console.log('Google login response:', data);

            if (!data || !data.Token) {
                throw new Error('Invalid response from server');
            }

            localStorage.setItem('user', JSON.stringify(data));
            console.log('User stored in localStorage, navigating to home...');

            logInAsUser();
            navigate('/');
        } catch (error) {
            console.error('Google Login error:', error);
            alert('Google Login failed! ' + error.message);
        }
    };

    useEffect(() => {
        console.log('Checking Google authentication...');
        if (location.search.includes('code=')) {
            console.log('Google auth code detected, attempting to log in...');
            checkGoogleAuth();
        }
    }, [location.search]);

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sign in</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
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
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            required
                        />
                        {formik.errors.password && (
                            <div className="error-message">{formik.errors.password}</div>
                        )}
                    </div>
                    <div className="form-links">
                        <Link to="/register" className="create-account-link">
                            Create new account
                        </Link>
                        <a href="/forgot-password" className="forgot-password-link">
                            Forgot your password?
                        </a>
                    </div>
                    <button type="submit" className="login-button">
                        Sign in
                    </button>

                    {/* Nút đăng nhập với Google */}
                    <button
                        type="button"
                        className="google-login-button"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle className="google-icon" /> Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
