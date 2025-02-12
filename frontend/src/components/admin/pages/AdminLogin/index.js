import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import AuthContext from '~/context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { logInAsAdmin } = useContext(AuthContext);

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
                const response = await axios.post('http://localhost:5180/api/AdminLogin', values);

                console.log('API Response:', response.data);
                logInAsAdmin();
                navigate('/dashboard');
            } catch (error) {
                console.error('Login failed:', error.response?.data || error.message);
                alert(`Login failed! ${error.response?.data || error.message}`);
            }
        },
    });
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

                    <button type="submit" className="login-button">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
