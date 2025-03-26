import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UserSubmissions.module.scss';

const cs = classNames.bind(styles);

// Mapping of English status to Vietnamese status
const STATUS_TRANSLATIONS = {
    Accepted: 'Chấp nhận',
    'Wrong Answer': 'Sai đáp án',
    'Time Limit Exceeded': 'Vượt quá thời gian',
    'Memory Limit Exceeded': 'Vượt quá bộ nhớ',
    'Runtime Error': 'Lỗi thực thi',
    Pending: 'Đang chờ',
    'Compilation Error': 'Lỗi biên dịch',
};

const UserSubmissions = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        language: '',
    });
    const [languages, setLanguages] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const user = localStorage.getItem('user');
                if (!user) {
                    setError('User không tồn tại trong LocalStorage');
                    setLoading(false);
                    return;
                }

                const userObject = JSON.parse(user);
                const userId = userObject.id;

                let url = `http://localhost:5180/api/user/${userId}/submissions?pageNumber=${currentPage}&pageSize=10`;

                if (filters.status) {
                    // Use the English status for backend request
                    const englishStatus = Object.keys(STATUS_TRANSLATIONS).find(
                        (key) => STATUS_TRANSLATIONS[key] === filters.status,
                    );
                    url += `&status=${encodeURIComponent(englishStatus)}`;
                }

                if (filters.language) {
                    url += `&programmingLanguage=${encodeURIComponent(filters.language)}`;
                }

                // Fetch submissions
                const response = await axios.get(url);
                console.log('Dữ liệu phản hồi:', response.data.items);
                setSubmissions(response.data.items);
                setTotalPages(response.data.totalPages);

                // Fetch languages and statuses for filters
                if (languages.length === 0) {
                    const langResponse = await axios.get(
                        `http://localhost:5180/api/submission/languages?userId=${userId}`,
                    );
                    setLanguages(langResponse.data);
                }

                if (statuses.length === 0) {
                    const statusResponse = await axios.get(
                        `http://localhost:5180/api/submission/statuses?userId=${userId}`,
                    );
                    setStatuses(statusResponse.data);
                }
            } catch (err) {
                console.error('Error fetching submissions:', err);
                setError('Không thể tải danh sách bài nộp');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [currentPage, filters.status, filters.language]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const user = localStorage.getItem('user');
                if (!user) return;

                const userObject = JSON.parse(user);
                const userId = userObject.id;

                const langResponse = await axios.get(
                    `http://localhost:5180/api/submission/languages?userId=${userId}`,
                );
                setLanguages(langResponse.data);

                const statusResponse = await axios.get(
                    `http://localhost:5180/api/submission/statuses?userId=${userId}`,
                );
                setStatuses(statusResponse.data);
            } catch (err) {
                console.error('Error fetching filter options:', err);
            }
        };

        fetchFilterOptions();
    }, []);

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (type, value) => {
        setCurrentPage(1);
        setFilters({ ...filters, [type]: value });
    };

    const handleDownload = async (submission) => {
        try {
            const response = await axios({
                url: `http://localhost:5180/api/user/download-submission/${submission.submissionId}`,
                method: 'GET',
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `${submission.problemId}_${submission.problemTitle}_${submission.programmingLanguage}.zip`,
            );
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Không thể tải xuống mã nguồn');
        }
    };

    return (
        <div className={cs('profilePage')}>
            <div className={cs('profile-container')}>
                <div className={cs('profile-header')}>
                    <div className={cs('nav-tabs')}>
                        <button className={cs('nav-tab')} onClick={() => navigate('/profile')}>
                            Hồ sơ cá nhân
                        </button>
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
                        <button className={cs('nav-tab', 'active')}>Bài nộp</button>
                        <button className={cs('nav-tab')} onClick={() => navigate('/usercontest')}>
                            Cuộc thi
                        </button>
                    </div>
                </div>

                <div className={cs('submissions-container')}>
                    <div className={cs('filter-section')}>
                        <div className={cs('filter-item')}>
                            <label>Trạng thái:</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className={cs('filter-select')}
                            >
                                <option value="">Tất cả</option>
                                {Object.values(STATUS_TRANSLATIONS).map((vietnameseStatus) => (
                                    <option key={vietnameseStatus} value={vietnameseStatus}>
                                        {vietnameseStatus}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cs('filter-item')}>
                            <label>Ngôn ngữ:</label>
                            <select
                                value={filters.language}
                                onChange={(e) => handleFilterChange('language', e.target.value)}
                                className={cs('filter-select')}
                            >
                                <option value="">Tất cả</option>
                                {languages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className={cs('loading')}>Đang tải...</div>
                    ) : error ? (
                        <div className={cs('error')}>{error}</div>
                    ) : (
                        <>
                            <table className={cs('submissions-table')}>
                                <thead>
                                    <tr>
                                        <th>Bài tập</th>
                                        <th>Trạng thái</th>
                                        <th>Điểm</th>
                                        <th>Ngôn ngữ</th>
                                        <th>Thời gian</th>
                                        <th>Bộ nhớ</th>
                                        <th>Thời điểm nộp</th>
                                        <th>Tải về</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length > 0 ? (
                                        submissions.map((submission) => (
                                            <tr key={submission.submissionId}>
                                                <td>{submission.problemTitle}</td>
                                                <td>
                                                    <span
                                                        className={cs('status-badge', {
                                                            'status-accepted':
                                                                submission.status === 'Accepted',
                                                            'status-wrong':
                                                                submission.status ===
                                                                'Wrong Answer',
                                                            'status-time-limit':
                                                                submission.status ===
                                                                'Time Limit Exceeded',
                                                            'status-memory-limit':
                                                                submission.status ===
                                                                'Memory Limit Exceeded',
                                                            'status-runtime-error':
                                                                submission.status ===
                                                                'Runtime Error',
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
                                                <td>{submission.score}</td>
                                                <td>{submission.programmingLanguage}</td>
                                                <td>{submission.executeTime} ms</td>
                                                <td>{submission.memoryUsed} KB</td>
                                                <td>{formatDateTime(submission.submittedAt)}</td>
                                                <td>
                                                    <button
                                                        className={cs('download-button')}
                                                        onClick={() => handleDownload(submission)}
                                                    >
                                                        Tải về
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className={cs('no-data')}>
                                                Không có bài nộp nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className={cs('pagination')}>
                                    {currentPage > 1 && (
                                        <button
                                            className={cs('pagination-button')}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            &laquo; Trước
                                        </button>
                                    )}

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                className={cs('pagination-button', {
                                                    active: page === currentPage,
                                                })}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        ),
                                    )}

                                    {currentPage < totalPages && (
                                        <button
                                            className={cs('pagination-button')}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Sau &raquo;
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSubmissions;
