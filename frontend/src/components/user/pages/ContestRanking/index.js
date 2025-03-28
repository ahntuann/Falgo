import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fetchAllUserOfContestAPI, fetchBestSubmissionOfAUser } from '~/apis';
import useAuth from '~/hooks/useAuth';
import style from './ContestRanking.module.scss';

const cs = classNames.bind(style);

const USERS_PER_PAGE = 10;

function ContestRanking() {
    const location = useLocation();
    const state = location.state || {};
    const navigate = useNavigate();
    const { appUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const { contestId, contestName } = state.contest;
    const problems = state.problems;

    useEffect(() => {
        async function fetchData() {
            const users = await fetchAllUserOfContestAPI(contestId);

            const updatedUsers = await Promise.all(
                users.map(async (user) => {
                    let totalScore = 0;
                    let totalTime = 0;
                    const userWithScores = { ...user, scores: {}, totalScore: 0, totalTime: 0 };

                    await Promise.all(
                        problems.map(async (problem) => {
                            const submission = await fetchBestSubmissionOfAUser(
                                user.id,
                                contestId,
                                problem.problemId,
                            );
                            const score = submission?.point ?? 0;
                            const time = submission?.executeTime ?? 0;
                            userWithScores.scores[problem.problemId] = { score, time };
                            totalScore += score;
                            totalTime += time;
                        }),
                    );
                    userWithScores.totalScore = totalScore;
                    userWithScores.totalTime = totalTime;
                    return userWithScores;
                }),
            );

            updatedUsers.sort((a, b) => b.totalScore - a.totalScore || a.totalTime - b.totalTime);
            setUsers(updatedUsers);
        }

        fetchData();
    }, [contestId]);

    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const currentUsers = users.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE,
    );

    return (
        <div className={cs('wrapper')}>
            <div
                className={cs('backToContest')}
                onClick={() => navigate(`/contest/${contestId}`, { state: state.contest })}
            >
                <FontAwesomeIcon icon={faCaretLeft} className={cs('backIcon')} />
                Quay lại kỳ thi
            </div>

            <table className={cs('rankingTable')}>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Total Score</th>
                        <th>Total Time</th>
                        {problems.map((problem) => (
                            <th key={problem.problemId}>{problem.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                        <tr
                            key={user.id}
                            className={cs(
                                index < 3 ? `top${index + 1}` : 'normal',
                                index % 2 === 0 ? 'even' : 'odd',
                            )}
                        >
                            <td>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                            <td>
                                <img
                                    src={
                                        user?.avatar
                                            ? `http://localhost:5180${user?.avatar}`
                                            : 'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg'
                                    }
                                    alt={user.username}
                                    className={cs('avatar')}
                                />
                                {user.username}
                            </td>
                            <td>{user.totalScore}</td>
                            <td>{user.totalTime / 1000}s</td>
                            {problems.map((problem) => (
                                <td key={problem.problemId}>
                                    {user.scores[problem.problemId]?.score ?? '-'} (
                                    {user.scores[problem.problemId]?.time / 1000 + 's' ?? '-'})
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className={cs('pagination')}>
                <button
                    className={cs('pageButton')}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span>
                    Page {currentPage} / {totalPages}
                </span>
                <button
                    className={cs('pageButton')}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
}

export default ContestRanking;
