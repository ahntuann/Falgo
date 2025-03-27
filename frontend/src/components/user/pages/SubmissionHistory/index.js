import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '~/context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import styles from './SubmissionHistory.module.scss';
import classNames from 'classnames/bind';

const cs = classNames.bind(styles);

const SubmissionHistory = () => {
    const { problemId } = useParams();
    const { appUser } = useContext(AuthContext);
    const [totalPages, setTotalPages] = useState(1);
    const [submissions, setSubmissions] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [query, setQuery] = useState({
        SelectedDate: '',
        Status: '',
        PageNumber: 1,
        PageSize: 15,
    });

    const convertStatusToVietnamese = (status) => {
        switch (status) {
            case 'Compilation Error':
                return 'Lỗi biên dịch';
            case 'Time Limit Exceeded':
                return 'Quá thời gian thực thi';
            case 'Wrong Answer':
                return 'Sai đáp án';
            case 'Accepted':
                return 'Đã hoàn thành';
            case 'Runtime Error':
                return 'Lỗi thực thi';
            case 'Memory Limit Exceeded':
                return 'Vượt quá bộ nhớ';
            default:
                return status;
        }
    };

    useEffect(() => {
        fetchSubmissions();
        fetchStatuses();
        console.log(query.SelectedDate);
        console.log(styles.modalOverlay);
    }, [query]);

    const fetchSubmissions = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            const response = await axios.get(
                `http://localhost:5180/api/submission/history/${problemId}/${appUser.id}`,
                {
                    params: filteredQuery,
                },
            );
            setSubmissions(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching submissions', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5180/api/submission/history/status/${problemId}/${appUser.id}`,
                {
                    params: { problemId: problemId },
                },
            );
            setStatuses(response.data);
        } catch (error) {
            console.error('Error fetching statuses', error);
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'SelectedDate') {
            value = value ? new Date(value).toISOString().split('T')[0] : '';
        }

        setQuery({ ...query, [name]: value });
    };

    return (
        <div className={cs('container')}>
            <h2 className={cs('title')}>
                Lịch Sử Nộp Bài ({submissions.length > 0 ? submissions[0].problemTitle : ''})
            </h2>
            <div className={cs('filters')}>
                <input
                    type="date"
                    name="SelectedDate"
                    value={query.SelectedDate || ''}
                    onChange={handleChange}
                />
                <select name="Status" value={query.Status} onChange={handleChange}>
                    <option value="">Lọc theo Trạng Thái</option>
                    {statuses.map((status, index) => (
                        <option key={index} value={status}>
                            {convertStatusToVietnamese(status)}
                        </option>
                    ))}
                </select>
            </div>
            <table className={cs('table')}>
                <thead>
                    <tr>
                        <th>Điểm</th>
                        <th>Trạng Thái</th>
                        <th>Ngôn Ngữ</th>
                        <th>Thời Gian Chạy</th>
                        <th>Bộ Nhớ Sử Dụng</th>
                        <th>Thời Gian Nộp</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.length > 0 ? (
                        submissions.map((sub, index) => (
                            <tr key={index}>
                                <td>{sub.point}</td>
                                <td className={cs(sub.status.replace(/ /g, '-'))}>
                                    {convertStatusToVietnamese(sub.status)}
                                </td>
                                <td>{sub.programmingLanguage}</td>
                                <td>{sub.executeTime}s</td>
                                <td>{sub.memoryUsed}MB</td>
                                <td>{format(new Date(sub.submittedAt), 'yyyy-MM-dd HH:mm')}</td>
                                <td>
                                    <button
                                        className={cs('view-code-btn')}
                                        onClick={() => {
                                            setSelectedSubmission(sub);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Xem Mã
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>
                                Không có kết quả phù hợp
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && (
                <div className={cs('modalOverlay')}>
                    <div className={cs('modalContent')}>
                        <h3>Mã Nguồn</h3>
                        <pre>{selectedSubmission?.sourceCode || 'Không có mã nguồn'}</pre>
                        <button onClick={() => setIsModalOpen(false)}>Đóng</button>
                    </div>
                </div>
            )}

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

export default SubmissionHistory;
