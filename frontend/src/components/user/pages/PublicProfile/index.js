import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './PublicProfile.module.scss';

const cs = classNames.bind(styles);

const STATUS_TRANSLATIONS = {
    Accepted: 'Đã hoàn thành',
    'Wrong Answer': 'Sai đáp án',
    'Time Limit Exceeded': 'Quá thời gian thực thi',
    'Memory Limit Exceeded': 'Vượt quá bộ nhớ',
    'Runtime Error': 'Lỗi thực thi',
    Pending: 'Đang chờ',
    'Compilation Error': 'Lỗi biên dịch',
};
const DIFFICULTY_TRANSLATIONS = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
};
const PublicProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        dateOfBirth: '',
        phoneNumber: '',
        createdAt: '',
        totalSubmissions: 0,
        totalSolved: 0,
        avatar: '',
        address: '',
    });

    const [accuracyData, setAccuracyData] = useState({
        correctSubmissions: 0,
        incorrectSubmissions: 0,
        accuracyPercentage: 0,
    });

    const [topLanguages, setTopLanguages] = useState([]);
    const [problemCategories, setProblemCategories] = useState([]);
    const [submissions, setSubmissions] = useState({
        items: [],
        totalPages: 1,
        currentPage: 1,
    });
    const [contests, setContests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    const fetchUserData = async (page = 1) => {
        try {
            setLoading(true);

            // Fetch user profile
            const profileResponse = await axios.get(
                `http://localhost:5180/api/user/profile/${userId}`,
            );
            setUser(profileResponse.data);

            // Calculate accuracy
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

            // Fetch top languages
            const languagesResponse = await axios.get(
                `http://localhost:5180/api/user/${userId}/top-languages`,
            );
            setTopLanguages(languagesResponse.data.data);

            // Fetch problem categories
            const categoriesResponse = await axios.get(
                `http://localhost:5180/api/user/${userId}/problem-categories`,
            );
            setProblemCategories(categoriesResponse.data.data);

            // Fetch user submissions
            const submissionsResponse = await axios.get(
                `http://localhost:5180/api/user/${userId}/submissions?PageNumber=${page}&PageSize=10`,
            );
            setSubmissions({
                items: submissionsResponse.data.items,
                totalPages: submissionsResponse.data.totalPages,
                currentPage: page,
            });

            // Fetch user contests
            const contestsResponse = await axios.get(
                `http://localhost:5180/api/user/${userId}/contests`,
            );
            setContests(contestsResponse.data);
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

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleSubmissionPageChange = (newPage) => {
        fetchUserData(newPage);
    };

    if (loading) {
        return <div className={cs('loading')}>Đang tải...</div>;
    }

    if (error) {
        return <div className={cs('error')}>{error}</div>;
    }

    return (
        <div className={cs('profilePage')}>
            <div className={cs('profile-container')}>
                <div className={cs('profile-layout')}>
                    {/* Profile Sidebar - Left Column */}
                    <div className={cs('profile-sidebar')}>
                        <div className={cs('profile-avatar')}>
                            <img
                                src={
                                    user.avatar
                                        ? `http://localhost:5180${user.avatar}`
                                        : 'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg'
                                }
                                alt="Avatar người dùng"
                            />
                        </div>

                        <div className={cs('profile-info')}>
                            {[
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
                    </div>

                    {/* Profile Content - Right Column */}
                    <div className={cs('profile-content')}>
                        {/* User Statistics */}
                        <div className={cs('user-statistics')}>
                            <div className={cs('statistics-section')}>
                                <h2>Các Ngôn Ngữ Lập Trình Thường Sử Dụng</h2>
                                <p>
                                    {topLanguages.map(
                                        (lang, index) =>
                                            `${lang.language}: ${lang.count} bài ${
                                                index < topLanguages.length - 1 ? '| ' : ''
                                            }`,
                                    )}
                                </p>
                            </div>

                            <div className={cs('statistics-section')}>
                                <h2>Các Loại Bài Tập Đã Làm</h2>
                                <p>
                                    {problemCategories.map(
                                        (category, index) =>
                                            `${category.category}: ${category.percentage.toFixed(
                                                2,
                                            )}% ${
                                                index < problemCategories.length - 1 ? '| ' : ''
                                            }`,
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* User Submissions */}
                        <div className={cs('user-submissions')}>
                            <h2>Các Bài Nộp Gần Đây</h2>
                            <table className={cs('submissions-table')}>
                                <thead>
                                    <tr>
                                        <th>Mã Bài</th>
                                        <th>Tên Bài</th>
                                        <th>Ngôn Ngữ</th>
                                        <th>Trạng Thái</th>
                                        <th>Thời Gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.items.map((submission) => (
                                        <tr key={submission.id}>
                                            <td>{submission.problemId}</td>
                                            <td>{submission.problemTitle}</td>
                                            <td>{submission.programmingLanguage}</td>
                                            <td>
                                                <span
                                                    className={cs('status-badge', {
                                                        'status-accepted':
                                                            submission.status === 'Accepted',
                                                        'status-wrong':
                                                            submission.status === 'Wrong Answer',
                                                        'status-time-limit':
                                                            submission.status ===
                                                            'Time Limit Exceeded',
                                                        'status-memory-limit':
                                                            submission.status ===
                                                            'Memory Limit Exceeded',
                                                        'status-runtime-error':
                                                            submission.status === 'Runtime Error',
                                                        'status-other': ![
                                                            'Accepted',
                                                            'Wrong Answer',
                                                            'Time Limit Exceeded',
                                                            'Memory Limit Exceeded',
                                                            'Runtime Error',
                                                        ].includes(submission.status),
                                                    })}
                                                >
                                                    {STATUS_TRANSLATIONS[submission.status] ||
                                                        submission.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(submission.submittedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className={cs('pagination')}>
                                <button
                                    disabled={submissions.currentPage === 1}
                                    onClick={() =>
                                        handleSubmissionPageChange(submissions.currentPage - 1)
                                    }
                                >
                                    &lt;
                                </button>

                                {Array.from({ length: submissions.totalPages }, (_, i) => i + 1)
                                    .filter(
                                        (page) =>
                                            page === 1 ||
                                            page === submissions.totalPages ||
                                            Math.abs(page - submissions.currentPage) <= 2,
                                    )
                                    .map((page) => (
                                        <button
                                            key={page}
                                            className={
                                                page === submissions.currentPage ? cs('active') : ''
                                            }
                                            onClick={() => handleSubmissionPageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                <button
                                    disabled={submissions.currentPage === submissions.totalPages}
                                    onClick={() =>
                                        handleSubmissionPageChange(submissions.currentPage + 1)
                                    }
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>

                        {/* User Contests */}
                        <div className={cs('user-contests')}>
                            <h2>Các Cuộc Thi Đã Tham Gia</h2>
                            <table className={cs('contests-table')}>
                                <thead>
                                    <tr>
                                        <th>Tên Cuộc Thi</th>
                                        <th>Ngày Bắt Đầu</th>
                                        <th>Ngày Kết Thúc</th>
                                        <th>Độ Khó</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contests.map((contest) => (
                                        <tr key={contest.id}>
                                            <td>{contest.contestName}</td>
                                            <td>{formatDate(contest.createdAt)}</td>
                                            <td>{formatDate(contest.endDate)}</td>
                                            <td>
                                                <span
                                                    className={cs('difficulty-badge', {
                                                        'difficulty-easy': contest.level === 'easy',
                                                        'difficulty-medium':
                                                            contest.level === 'medium',
                                                        'difficulty-hard': contest.level === 'hard',
                                                    })}
                                                >
                                                    {DIFFICULTY_TRANSLATIONS[contest.level] ||
                                                        contest.level}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
