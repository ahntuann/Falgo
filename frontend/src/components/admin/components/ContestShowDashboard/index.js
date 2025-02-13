import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './contestDashboard.Module.scss';

const cx = classNames.bind(styles);

function ContestDashboard({ contest }) {
    const { contestId, banner, contestName, totalPoint, level, endDate, dueTime, numRegis } =
        contest;

    return (
        <div className={cx('contestContainer')}>
            {contest !== undefined && (
                <div className={cx('tableContainer')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Due Time</th>
                                <th>Points</th>
                                <th>Level</th>
                                <th>End Date</th>
                                <th>Registrations</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{contestId}</td>
                                <td>{contestName}</td>
                                <td>{dueTime}</td>
                                <td>{totalPoint}</td>
                                <td>{level}</td>
                                <td>{new Date(endDate).toLocaleString()}</td>
                                <td>{numRegis}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ContestDashboard;
