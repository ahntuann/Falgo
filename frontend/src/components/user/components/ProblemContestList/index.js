import React from 'react';
import classNames from 'classnames/bind';
import style from './ProblemContestList.module.scss';
import { useNavigate } from 'react-router-dom';

const cs = classNames.bind(style);

const ProblemContestList = ({ contestId, problems, isStart, isEnd, contest }) => {
    const navigate = useNavigate();

    return (
        <div className={cs('problemList')}>
            <h2>Danh sách bài toán</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Bài toán</th>
                        <th>Điểm</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((problem, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <div
                                    className={cs('link')}
                                    onClick={() => {
                                        if (isEnd) {
                                            alert('Đã hết giờ!');
                                        } else if (!isStart) {
                                            alert('Bạn phải ấn "Bắt đầu thi" để làm bài');
                                        } else if (contest.contestStatus === 'over') {
                                            navigate(`/problems/${problem.problemId}`);
                                        } else {
                                            navigate(
                                                `/problems/${problem.problemId}?contestId=${contestId}`,
                                                { state: contest },
                                            );
                                        }
                                    }}
                                >
                                    {problem.title}
                                </div>
                            </td>
                            <td>{problem.score ?? '-'}</td>
                            <td className={cs(`status ${problem.status}`)}>
                                {problem?.score === problem.totalPoint ? '✅' : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProblemContestList;
