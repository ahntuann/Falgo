import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './SubmissionList.module.scss';

const cs = classNames.bind(styles);

const SubmissionList = () => {
    const { problemId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubmissions, setTotalSubmissions] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [submittersName, setSubmittersName] = useState([]);
    const [query, setQuery] = useState({
        UserId: '',
        ProblemId: '',
        UserName: '',
        Status: '',
        ProgrammingLanguage: '',
        PageNumber: 1,
        PageSize: 15,
    });

    useEffect(() => {
        fetchLanguages();
        fetchSubmissions();
        fetchStatuses();
        fetchSubmittersName();
    }, [query]);

    const fetchSubmissions = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            const response = await axios.get(`http://localhost:5180/api/submission/${problemId}`, {
                params: filteredQuery,
            });
            setSubmissions(response.data.items);
            setTotalPages(response.data.totalPages);
            setTotalSubmissions(response.data.totalItems);
        } catch (error) {
            console.error('Error fetching submissions', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get(`http://localhost:5180/api/submission/status`, {
                params: { problemId: problemId },
            });
            setStatuses(response.data);
        } catch (error) {
            console.error('Error fetching statuses', error);
        }
    };

    const fetchLanguages = async () => {
        try {
            const response = await axios.get(`http://localhost:5180/api/submission/language`, {
                params: { problemId: problemId },
            });
            setLanguages(response.data);
            console.log('Languages:', languages);
            console.log('Selected Language:', query.ProgrammingLanguage);
        } catch (error) {
            console.error('Error fetching languages', error);
        }
    };

    const fetchSubmittersName = async () => {
        try {
            const response = await axios.get(`http://localhost:5180/api/submission/username`, {
                params: { problemId: problemId },
            });
            setSubmittersName(response.data);
            console.log('name::', submittersName);
            console.log('Selected user:', query.UserName);
        } catch (error) {
            console.error('Error fetching sumitter name', error);
        }
    };

    const handleChange = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value });
    };

    return (
        <div className={cs('submissionList')}>
            {submissions?.length > 0 && (
                <h2>
                    Danh sách bài nộp ({submissions.at(0).problemTitle} - {totalSubmissions} bài
                    nộp)
                </h2>
            )}
            <div className={cs('filters')}>
                <select name="UserName" value={query.UserName} onChange={handleChange}>
                    <option value="">Tất cả người dùng</option>
                    {submittersName.map((submitter, index) => (
                        <option key={index} value={submitter}>
                            {submitter}
                        </option>
                    ))}
                </select>
                <select name="Status" value={query.Status} onChange={handleChange}>
                    <option value="">Tất cả trạng thái</option>
                    {statuses.map((status, index) => (
                        <option key={index} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <select
                    name="ProgrammingLanguage"
                    value={query.ProgrammingLanguage}
                    onChange={handleChange}
                >
                    <option value="">Tất cả ngôn ngữ</option>
                    {languages.map((lang, index) => (
                        <option key={index} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Người nộp</th>
                        <th>Điểm</th>
                        <th>Trạng thái</th>
                        <th>Ngôn ngữ</th>
                        <th>Thời gian thực thi</th>
                        <th>Bộ nhớ đã dùng</th>
                        <th>Thời gian nộp</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission, i) => {
                        const isFiltered =
                            query.UserName || query.Status || query.ProgrammingLanguage;
                        const actualIndex = (query.PageNumber - 1) * query.PageSize + i;
                        return (
                            <tr key={i} className={cs({ topRank: !isFiltered && actualIndex < 3 })}>
                                <td>{submission.submitterName}</td>
                                <td>{submission.score}</td>
                                <td>{submission.status}</td>
                                <td>{submission.programmingLanguage}</td>
                                <td>{submission.executeTime}</td>
                                <td>{submission.memoryUsed}</td>
                                <td>
                                    {new Date(submission.submittedAt).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>{' '}
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

export default SubmissionList;
