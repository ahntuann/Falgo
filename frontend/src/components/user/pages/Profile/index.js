import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from 'recharts';
import styles from './Profile.module.scss';
import { useNavigate } from 'react-router-dom';

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
        preferredLanguages: [],
        solvedExerciseTypes: {},
    });

    const [accuracyData, setAccuracyData] = useState({
        correctSubmissions: 0,
        incorrectSubmissions: 0,
        accuracyPercentage: 0,
    });

    // New state for top languages and problem categories
    const [topLanguages, setTopLanguages] = useState([]);
    const [problemCategories, setProblemCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    // Colors for visualization
    const ACCURACY_COLORS = ['#00C49F', '#FF6384'];
    const LANGUAGE_COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884D8'];
    const CATEGORY_COLORS = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#C9CBCF',
        '#7AC142',
        '#F47C7C',
        '#845EC2',
    ];

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

                // Gọi API với userId lấy từ LocalStorage
                const profileResponse = await axios.get(
                    `http://localhost:5180/api/user/profile/${userId}`,
                );

                setUser(profileResponse.data);

                // Tính toán tỷ lệ bài làm đúng
                const totalSubmissions = profileResponse.data.totalSubmissions || 0;
                const totalSolved = profileResponse.data.totalSolved || 0;
                const incorrectSubmissions = totalSubmissions - totalSolved;
                const accuracyPercentage =
                    totalSubmissions > 0 ? ((totalSolved / totalSubmissions) * 100).toFixed(2) : 0;

                setAccuracyData({
                    correctSubmissions: totalSolved,
                    incorrectSubmissions: incorrectSubmissions,
                    accuracyPercentage: accuracyPercentage,
                });

                if (totalSubmissions === 0) {
                    // Nếu chưa có bài nộp, set giá trị mặc định
                    setTopLanguages([{ name: 'Không có', percentage: 100 }]);
                    setProblemCategories([{ name: 'Không có', percentage: 100 }]);
                } else {
                    // Fetch top programming languages
                    const languagesResponse = await axios.get(
                        `http://localhost:5180/api/user/${userId}/top-languages`,
                    );

                    // Fetch problem categories
                    const categoriesResponse = await axios.get(
                        `http://localhost:5180/api/user/${userId}/problem-categories`,
                    );

                    setTopLanguages(languagesResponse.data.data);
                    setProblemCategories(categoriesResponse.data.data);
                }
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

    const accuracyChartData = [
        { name: 'Đúng', value: accuracyData.correctSubmissions },
        { name: 'Sai', value: accuracyData.incorrectSubmissions },
    ];

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
                            { key: 'totalSolved', label: 'Số bài đã giải đúng' },
                            { key: 'accuracy', label: 'Tỷ lệ bài làm đúng' },
                        ].map(({ key, label }, index) => (
                            <div key={index} className={cs('info-row')}>
                                <div className={cs('info-label')}>{label}</div>
                                <div className={cs('info-value')}>
                                    {key === 'createdAt' || key === 'dateOfBirth'
                                        ? formatDate(user[key])
                                        : key === 'accuracy'
                                        ? `${accuracyData.accuracyPercentage}%`
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

                        {/* Biểu đồ tròn thể hiện tỷ lệ bài làm đúng/sai */}
                        {accuracyData.correctSubmissions + accuracyData.incorrectSubmissions >
                            0 && (
                            <div style={{ width: '100%', height: 200, marginTop: 20 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={accuracyChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {accuracyChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        ACCURACY_COLORS[
                                                            index % ACCURACY_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [
                                                `${value} bài (${(
                                                    (value /
                                                        (accuracyData.correctSubmissions +
                                                            accuracyData.incorrectSubmissions)) *
                                                    100
                                                ).toFixed(2)}%)`,
                                                name,
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            <span style={{ color: ACCURACY_COLORS[0], marginRight: 10 }}>
                                ■ Đúng: {accuracyData.correctSubmissions} bài
                            </span>
                            <span style={{ color: ACCURACY_COLORS[1] }}>
                                ■ Sai: {accuracyData.incorrectSubmissions} bài
                            </span>
                        </div>
                    </div>
                </div>

                {/* Thêm phần thống kê ngôn ngữ và loại bài tập */}

                <div className={cs('user-statistics')}>
                    <div className={cs('statistics-section')}>
                        <h2> 5 Ngôn ngữ tập trình thường sử dụng</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topLanguages}>
                                <XAxis dataKey="languageName" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value} bài`,
                                        'Số lượng bài làm',
                                    ]}
                                />
                                <Bar dataKey="count" fill="#8884d8">
                                    {topLanguages.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            {topLanguages.map((lang, index) => (
                                <span
                                    key={index}
                                    style={{
                                        color: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
                                        marginRight: 10,
                                    }}
                                >
                                    ■ {lang.language}: {lang.count} bài{' '}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={cs('statistics-section')}>
                        <h2>Các Loại Bài Tập Đã Làm</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={problemCategories}>
                                <XAxis dataKey="categoryName" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) => [`${value.toFixed(2)}%`, 'Tỷ lệ']}
                                />
                                <Bar dataKey="percentage" fill="#8884d8">
                                    {problemCategories.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            {problemCategories.map((category, index) => (
                                <span
                                    key={index}
                                    style={{
                                        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                                        marginRight: 10,
                                    }}
                                >
                                    ■ {category.category}: {category.percentage.toFixed(2)}%
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
