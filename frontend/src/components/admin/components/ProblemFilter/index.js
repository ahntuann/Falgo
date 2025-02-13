import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProblemFilter.Module.scss';

const cx = classNames.bind(styles);

const ProblemFilter = () => {
    const [numProblems, setNumProblems] = useState(10);
    const [isAscending, setIsAscending] = useState(true);
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const url = `http://localhost:5180/api/AdminDashboard/problem?NumberOfProb=${numProblems}&IsAscending=${isAscending}`;
            console.log('Sending Request to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response Data:', data);
            setProblems(data);
        } catch (error) {
            setError(error.message || 'Request failed');
            console.error('Error:', error);
        }
    };

    return (
        <div className={cx('container')}>
            <h2 className={cx('title')}>Filter Problems</h2>
            <form onSubmit={handleSubmit} className={cx('form')}>
                <label className={cx('label')}>
                    Number of Problems:
                    <input
                        type="number"
                        value={numProblems}
                        onChange={(e) => setNumProblems(Number(e.target.value))}
                        min="1"
                        className={cx('input')}
                    />
                </label>

                <label className={cx('label')}>
                    Sort Order:
                    <select
                        value={isAscending}
                        onChange={(e) => setIsAscending(e.target.value === 'true')}
                        className={cx('select')}
                    >
                        <option value="true">Ascending</option>
                        <option value="false">Descending</option>
                    </select>
                </label>

                <button type="submit" className={cx('button')}>
                    Filter
                </button>
            </form>

            {error && <p className={cx('error')}>Error: {error}</p>}

            {problems.length > 0 && (
                <div className={cx('tableContainer')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Score</th>
                                <th>Submissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem) => (
                                <tr key={problem.problemId}>
                                    <td>{problem.title}</td>
                                    <td>{problem.category}</td>
                                    <td>{problem.score}</td>
                                    <td>{problem.numberOfSubmissions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProblemFilter;
