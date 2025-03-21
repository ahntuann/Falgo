import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UserContest.module.scss';

const cs = classNames.bind(styles);

const UserContest = () => {
    const navigate = useNavigate();
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'completed'

    useEffect(() => {
        const fetchUserContests = async () => {
            try {
                setLoading(true);

                // Get user from LocalStorage
                const user = localStorage.getItem('user');
                if (!user) {
                    setError('User không tồn tại trong LocalStorage');
                    setLoading(false);
                    return;
                }

                // Parse JSON string to object
                const userObject = JSON.parse(user);
                const userId = userObject.id;

                console.log('Đang gọi API với userId:', userId);

                // Call API with userId from LocalStorage
                const response = await axios.get(
                    `http://localhost:5180/api/user/${userId}/contests`,
                );

                console.log('Kết quả API contests:', response.data);
                setContests(response.data);
            } catch (err) {
                const errorMessage =
                    err.response && err.response.data
                        ? typeof err.response.data === 'string'
                            ? err.response.data
                            : JSON.stringify(err.response.data)
                        : err.message;
                console.error('Chi tiết lỗi:', errorMessage);
                setError(`Không thể tải thông tin cuộc thi: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserContests();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatDueTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours} giờ ${remainingMinutes > 0 ? `${remainingMinutes} phút` : ''}`;
        } else {
            return `${minutes} phút`;
        }
    };

    const getFilteredContests = () => {
        if (activeFilter === 'all') {
            return contests;
        } else if (activeFilter === 'active') {
            return contests.filter((contest) => new Date(contest.endDate) > new Date());
        } else {
            return contests.filter((contest) => new Date(contest.endDate) <= new Date());
        }
    };

    const handleContestClick = (contestId) => {
        navigate(`/contest/${contestId}`);
    };

    if (loading) {
        return <div className={cs('loading')}>Đang tải...</div>;
    }

    if (error) {
        return <div className={cs('error')}>{error}</div>;
    }

    const filteredContests = getFilteredContests();

    return (
        <div className={cs('contestsPage')}>
            <div className={cs('contests-container')}>
                <div className={cs('contests-header')}>
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
                        <button
                            className={cs('nav-tab')}
                            onClick={() => navigate('/usersubmissions')}
                        >
                            Bài nộp
                        </button>
                        <button className={cs('nav-tab', 'active')}>Cuộc thi</button>
                    </div>
                </div>

                <div className={cs('filter-container')}>
                    <button
                        className={cs('filter-button', { active: activeFilter === 'all' })}
                        onClick={() => setActiveFilter('all')}
                    >
                        Tất cả
                    </button>
                    <button
                        className={cs('filter-button', { active: activeFilter === 'active' })}
                        onClick={() => setActiveFilter('active')}
                    >
                        Đang diễn ra
                    </button>
                    <button
                        className={cs('filter-button', { active: activeFilter === 'completed' })}
                        onClick={() => setActiveFilter('completed')}
                    >
                        Đã kết thúc
                    </button>
                </div>

                {filteredContests.length === 0 ? (
                    <div className={cs('no-contests')}>
                        <p>Không có cuộc thi nào</p>
                    </div>
                ) : (
                    <div className={cs('contests-list')}>
                        {filteredContests.map((contest) => (
                            <div
                                key={contest.contestId}
                                className={cs('contest-card', {
                                    completed: new Date(contest.endDate) <= new Date(),
                                })}
                                onClick={() => handleContestClick(contest.contestId)}
                            >
                                <div className={cs('contest-header')}>
                                    <h3 className={cs('contest-name')}>{contest.contestName}</h3>
                                    <div className={cs('contest-status')}>
                                        {new Date(contest.endDate) <= new Date()
                                            ? 'Đã kết thúc'
                                            : 'Đang diễn ra'}
                                    </div>
                                </div>
                                <div className={cs('contest-details')}>
                                    <div className={cs('contest-info')}>
                                        <p>
                                            <span>Cấp độ:</span> {contest.level}
                                        </p>
                                        <p>
                                            <span>Điểm tối đa:</span> {contest.totalPoint}
                                        </p>
                                        <p>
                                            <span>Thời gian làm bài:</span>{' '}
                                            {formatDueTime(contest.dueTime)}
                                        </p>
                                        <p>
                                            <span>Ngày tham gia:</span>{' '}
                                            {formatDate(contest.createdAt)}
                                        </p>
                                        <p>
                                            <span>Ngày kết thúc:</span>{' '}
                                            {formatDate(contest.endDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserContest;
