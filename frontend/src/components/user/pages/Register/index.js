import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import moment from 'moment';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // 👁 Trạng thái hiển thị mật khẩu

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
            fullName: Yup.string().required('Full name is required'),
            username: Yup.string().required('Username is required'),
            password: Yup.string()
                .min(12, 'At least 12 characters')
                .matches(/[0-9]/, 'Must contain at least one number')
                .matches(/[a-z]/, 'Must contain at least one lowercase letter')
                .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
                .matches(/[^a-zA-Z0-9]/, 'Must contain at least one special character')
                .required('Password is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phoneNumber: Yup.string().required('Phone number is required'),
            address: Yup.string().required('Address is required'),
            dob: Yup.date().required('Date of birth is required').nullable(),
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
                alert('Registration successful!');
                navigate('/login');
            } catch (error) {
                console.log('Error response:', error.response);
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
                    <div className="input-group password-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
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
                    <div className="input-group">
                        <input
                            type="datetime-local"
                            name="dob"
                            onChange={formik.handleChange}
                            value={formik.values.dob}
                        />
                    </div>
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
