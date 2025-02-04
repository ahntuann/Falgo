import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fullName: '',
            username: '',
            password: '',
            email: '',
            phoneNumber: '',
            address: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            username: Yup.string().required('Username is required'),
            password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phoneNumber: Yup.string().required('Phone number is required'),
            address: Yup.string().required('Address is required'),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post('http://localhost:5180/api/account/register', values);
                alert('Registration successful!');
                navigate('/login'); // Chuyển hướng đến trang đăng nhập
            } catch (error) {
                if (error.response && error.response.data) {
                    if (error.response.data === 'Username/Email is already in use.') {
                        alert('Username or Email is already in use. Please choose another.');
                    } else {
                        alert(`Registration failed: ${error.response.data}`);
                    }
                } else {
                    alert('Registration failed! Please try again.');
                }
            }
        },
    });

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Create new account</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full name"
                            onChange={formik.handleChange}
                            value={formik.values.fullName}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="User name"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                    </div>
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
                            placeholder="Phone number"
                            onChange={formik.handleChange}
                            value={formik.values.phoneNumber}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            onChange={formik.handleChange}
                            value={formik.values.address}
                        />
                    </div>
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>

                <div className="social-login">
                    <p>Do you have an account?</p>
                    <div className="social-icons">
                        <img src="https://www.google.com/favicon.ico" alt="Google" />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                            alt="GitHub"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
