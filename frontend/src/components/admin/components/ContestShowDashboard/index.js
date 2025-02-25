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
                                <th>Tên cuộc thi</th>
                                <th>thời gian thi</th>
                                <th>điểm</th>
                                <th>độ khó</th>
                                <th>ngày kết thúc</th>
                                <th>đăng ký</th>
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
