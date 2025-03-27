import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '~/context/AuthContext';
import axios from 'axios';
import styles from './Ranking.module.scss';
import classNames from 'classnames/bind';

const cs = classNames.bind(styles);

const Ranking = () => {
    const { appUser } = useContext(AuthContext);
    const [rankData, setRankData] = useState([]);
    const [top3, setTop3] = useState([]); // Top 3 cố định
    const [totalPages, setTotalPages] = useState(1);
    const [totalUser, setTotalUser] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [query, setQuery] = useState({
        FullName: '',
        PageNumber: 1,
        PageSize: 10,
        Type: 'overall',
    });

    const [debouncedFullName, setDebouncedFullName] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFullName(query.FullName);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [query.FullName]);

    useEffect(() => {
        fetchRankData();
    }, [debouncedFullName, query.PageNumber, query.PageSize, query.Type]);

    const fetchRankData = async () => {
        try {
            const params = {
                PageNumber: query.PageNumber,
                PageSize: query.PageSize,
                Type: query.Type,
            };
            if (query.FullName.trim() !== '') {
                params.FullName = query.FullName;
            }

            const response = await axios.get(`http://localhost:5180/api/Ranking`, { params });

            if (typeof response.data === 'string') {
                setRankData([]);
                setTop3([]);
                setTotalUser(0);
                setTotalPages(1);
                setNoDataMessage(response.data);
                return;
            }

            if (!response.data.items || response.data.items.length === 0) {
                setRankData([]);
                setTotalPages(1);
                return;
            }

            setNoDataMessage('');

            // Nếu đang ở trang đầu tiên và không có tìm kiếm, cập nhật top3
            if (query.PageNumber === 1 && query.FullName.trim() === '') {
                setTop3(response.data.items.slice(0, 3)); // Giữ top 3 cố định
            }

            // Danh sách bảng chỉ lấy từ dữ liệu còn lại
            setTotalUser(response.data.totalItems);
            setRankData(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        setQuery({ ...query, FullName: e.target.value, PageNumber: 1 });
    };

    return (
        <div className={cs('leaderboard')}>
            <h1 className={cs('title')}>Bảng Xếp Hạng ({totalUser} người tham gia)</h1>

            {/* Bộ lọc */}
            <div className={cs('filters')}>
                {['overall', 'yearly', 'quarterly', 'monthly', 'weekly'].map((filter) => (
                    <button
                        key={filter}
                        className={cs({ active: query.Type === filter })}
                        onClick={() =>
                            setQuery({ ...query, Type: filter, PageNumber: 1, FullName: '' })
                        }
                    >
                        {filter === 'overall'
                            ? 'Tổng thể'
                            : filter === 'yearly'
                            ? 'Năm'
                            : filter === 'quarterly'
                            ? 'Quý'
                            : filter === 'monthly'
                            ? 'Tháng'
                            : 'Tuần'}
                    </button>
                ))}
            </div>
            {noDataMessage && <p className={cs('no-data-message')}>{noDataMessage}</p>}
            <div className={cs('top-rank')}>
                {top3[1] && (
                    <div key={top3[1].rank} className={cs('rank-card', 'silver')}>
                        <div className={cs('avatar-container', 'silver')}>
                            <a href={`/profile/public/${top3[1].appUserId}`}>
                                <img
                                    src={
                                        top3[1].avatar
                                            ? `http://localhost:5180${top3[1].avatar}`
                                            : 'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg'
                                    }
                                    alt="Avatar"
                                    className={cs('avatar')}
                                />
                            </a>
                        </div>
                        <p className={cs('name')}>{top3[1].fullName}</p>
                        <p className={cs('score')}>{top3[1].score} điểm</p>
                        <p className={cs('problems-solved')}>{top3[1].totalProblem} câu hỏi</p>
                        <p className={cs('medal')}>🥈 Bạc</p>
                    </div>
                )}

                {top3[0] && (
                    <div key={top3[0].rank} className={cs('rank-card', 'gold')}>
                        <div className={cs('avatar-container', 'gold')}>
                            <a href={`/profile/public/${top3[0].appUserId}`}>
                                <img
                                    src={
                                        top3[0].avatar
                                            ? `http://localhost:5180${top3[0].avatar}`
                                            : 'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg'
                                    }
                                    alt="Avatar"
                                    className={cs('avatar')}
                                />
                            </a>
                        </div>
                        <p className={cs('name')}>{top3[0].fullName}</p>
                        <p className={cs('score')}>{top3[0].score} điểm</p>
                        <p className={cs('problems-solved')}>{top3[0].totalProblem} câu hỏi</p>
                        <p className={cs('medal')}>🥇 Vàng</p>
                    </div>
                )}

                {top3[2] && (
                    <div key={top3[2].rank} className={cs('rank-card', 'bronze')}>
                        <div className={cs('avatar-container', 'bronze')}>
                            <a href={`/profile/public/${top3[2].appUserId}`}>
                                <img
                                    src={
                                        top3[2].avatar
                                            ? `http://localhost:5180${top3[2].avatar}`
                                            : 'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg'
                                    }
                                    alt="Avatar"
                                    className={cs('avatar')}
                                />
                            </a>
                        </div>
                        <p className={cs('name')}>{top3[2].fullName}</p>
                        <p className={cs('score')}>{top3[2].score} điểm</p>
                        <p className={cs('problems-solved')}>{top3[2].totalProblem} câu hỏi</p>
                        <p className={cs('medal')}>🥉 Đồng</p>
                    </div>
                )}
            </div>
            <input
                type="text"
                placeholder="Tìm kiếm theo tên người dùng..."
                className={cs('search-box')}
                value={query.FullName}
                onChange={handleChange}
            />
            <table className={cs('ranking-table')}>
                <thead>
                    <tr>
                        <th>Hạng</th>
                        <th>Tên Người Dùng</th>
                        <th>Điểm</th>
                        <th>Số Bài Đã Giải</th>
                    </tr>
                </thead>
                <tbody>
                    {rankData.map((user) => (
                        <tr key={user.rank}>
                            <td>{user.rank}</td>
                            <td className={cs('user-info')}>
                                <Link to={`/profile/public/${user.appUserId}`}>
                                    <img
                                        src={
                                            user.avatar
                                                ? `http://localhost:5180/${user.avatar}`
                                                : 'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg'
                                        }
                                        alt="Avatar"
                                        className={cs('table-avatar')}
                                    />
                                </Link>
                                <span>{user.fullName}</span>
                            </td>
                            <td>{user.score}</td>
                            <td>{user.totalProblem}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={cs('pagination')}>
                <button
                    disabled={query.PageNumber === 1}
                    onClick={() => setQuery({ ...query, PageNumber: query.PageNumber - 1 })}
                >
                    &lt;
                </button>

                {query.PageNumber > 3 && (
                    <>
                        <button onClick={() => setQuery({ ...query, PageNumber: 1 })}>1</button>
                        <span className={cs('dots')}>...</span>
                    </>
                )}

                {Array.from({ length: 5 }, (_, i) => query.PageNumber - 2 + i)
                    .filter((page) => page >= 1 && page <= totalPages)
                    .map((page) => (
                        <button
                            key={page}
                            className={page === query.PageNumber ? cs('active') : ''}
                            onClick={() => setQuery({ ...query, PageNumber: page })}
                        >
                            {page}
                        </button>
                    ))}

                {query.PageNumber < totalPages - 2 && (
                    <>
                        <span className={cs('dots')}>...</span>
                        <button onClick={() => setQuery({ ...query, PageNumber: totalPages })}>
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    disabled={query.PageNumber === totalPages}
                    onClick={() => setQuery({ ...query, PageNumber: query.PageNumber + 1 })}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Ranking;
