import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '~/context/AuthContext';
import './ProblemDetail.module.scss';
import classNames from 'classnames/bind';
import styles from './ProblemDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(styles);

const ProblemDetail = () => {
    const { problemId } = useParams();
    const { appUser } = useContext(AuthContext);
    const [problem, setProblem] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const contest = location.state || {};

    const { contestId } = contest;

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:5180/api/Problem/problemDetail?ProblemId=${problemId}`)
            .then((response) => {
                setProblem(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Bài tập không tồn tại.');
                setLoading(false);
            });
        axios
            .get(`http://localhost:5180/api/programinglanguage`)
            .then((response) => setLanguages(response.data))
            .catch((err) => console.error('Error fetching languages:', err));
    }, [problemId]);

    if (loading) return <div style={{ color: 'white' }}>Đang tải...</div>;
    if (error) return <div style={{ color: 'white' }}>{error}</div>;

    return (
        <div className={cs('problem-detail')}>
            {contestId !== null && contestId !== undefined && (
                <div
                    className={cs('backToContest')}
                    onClick={() =>
                        navigate(`/contest/${contestId}`, {
                            state: contest,
                        })
                    }
                >
                    <FontAwesomeIcon icon={faCaretLeft} className={cs('backIcon')} />
                    Quay lại kỳ thi
                </div>
            )}

            <h1 className={cs('title')}>{problem.title}</h1>
            <div className={cs('section')}>
                <h2>Thông tin bài tập</h2>
                <p>
                    <strong>Mô tả:</strong>{' '}
                    <div
                        className="content-container"
                        dangerouslySetInnerHTML={{ __html: problem.detail }}
                    />
                </p>
                <p>
                    <strong>Giới hạn thời gian:</strong> {problem.timeLimit} giây
                </p>
                <p>
                    <strong>Giới hạn bộ nhớ:</strong> {problem.memoryLimit} MB
                </p>
                <p>
                    <strong>Điểm tối đa:</strong> {problem.totalPoint}
                </p>
                <p>
                    <strong>Tác giả:</strong> {problem.author}
                </p>
            </div>
            <div className={cs('section')}>
                <h2>Mẫu Input & Output</h2>
                <div className={cs('example')}>
                    <strong>Input:</strong>
                    <pre>{problem.input}</pre>
                </div>
                <div className={cs('example')}>
                    <strong>Output:</strong>
                    <pre>{problem.output}</pre>
                </div>
            </div>
            <div className={cs('section')}>
                <h2>Thông tin bổ sung</h2>
                <p>
                    <strong>Loại bài toán:</strong> {problem.category || 'Chưa có thông tin'}
                </p>
                <p>
                    <strong>Ngôn ngữ lập trình hỗ trợ:</strong>{' '}
                    <span className={styles.languages}>
                        {languages.map((lang) => lang.language).join(', ')}
                    </span>
                </p>
            </div>
            <div className={cs('actions')}>
                {contestId !== null && contestId !== undefined ? (
                    <div
                        onClick={() =>
                            navigate(`/practice?id=${problemId}&contestId=${contestId}`, {
                                state: contest,
                            })
                        }
                        className={cs('button', 'primary')}
                    >
                        Làm bài
                    </div>
                ) : (
                    <Link to={`/practice?id=${problemId}`} className={cs('button', 'primary')}>
                        Làm bài
                    </Link>
                )}
                {!appUser ? (
                    <Link to="/login" className={cs('button', 'secondary')}>
                        Lịch sử nộp bài
                    </Link>
                ) : (
                    <Link
                        to={`/submissions/history/${problemId}`}
                        className={cs('button', 'secondary')}
                    >
                        Lịch sử nộp bài
                    </Link>
                )}
                <Link to={`/submissions/${problemId}`} className={cs('button', 'secondary')}>
                    Danh sách bài nộp
                </Link>
                <Link to="/problems" className={cs('button', 'back')}>
                    Danh sách bài tập
                </Link>
            </div>
        </div>
    );
};

export default ProblemDetail;
