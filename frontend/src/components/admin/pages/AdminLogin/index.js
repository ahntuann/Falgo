import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.Module.scss';
import AuthContext from '~/context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { logInAsAdmin, userRole } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Không được bỏ trống'),
            password: Yup.string().required('Không được bỏ trống'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:5180/api/AdminLogin', values);

                console.log('API Response:', response.data);
                if (response.data == true) {
                    logInAsAdmin();
                    const role = 'admin1';
                    sessionStorage.setItem('admin', JSON.stringify(role));
                    navigate('/Dashboard');
                }
            } catch (error) {
                console.error('Login failed:', error.response?.data || error.message);
                alert(`Đăng nhập thất bại! ${error.response?.data || error.message}`);
            }
        },
    });

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Đăng nhập</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="admin-input-group">
                        <label htmlFor="username">Tên người dùng</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            required
                        />
                        {formik.errors.username && (
                            <div className="admin-error-message">{formik.errors.username}</div>
                        )}
                    </div>
                    <div className="admin-input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            required
                        />
                        {formik.errors.password && (
                            <div className="admin-error-message">{formik.errors.password}</div>
                        )}
                    </div>

                    <button type="submit" className="admin-login-button">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
