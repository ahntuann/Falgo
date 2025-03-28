import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './ProblemContestList.module.scss';

const cs = classNames.bind(style);

const ProblemContestList = ({ contestId, problems, isStart, isEnd }) => {
    console.log(isStart);
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
                                <Link
                                    onClick={(event) => {
                                        if (isEnd) {
                                            event.preventDefault();
                                            alert('Đã hết giờ!');
                                        } else if (!isStart) {
                                            event.preventDefault();
                                            alert('Bạn phải ấn "Bắt đầu" để làm bài');
                                        }
                                    }}
                                    to={`/practice?id=${problem.problemId}`}
                                >
                                    {problem.title}
                                </Link>
                            </td>
                            <td>{problem.score ?? '-'}</td>
                            <td className={cs(`status ${problem.status}`)}>
                                {problem.status === 'solved' ? '✅' : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProblemContestList;
