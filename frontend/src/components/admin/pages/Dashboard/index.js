import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './dashboard.module.scss';
import { DateFilterUser, DateFilterSubmissions } from '~/components/admin/components';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function Dashboard() {
    const userType = 'user';
    const submissionsType = 'submissions';
    const problemType = 'probelm';
    const [filteredDataUser, setFilteredData] = useState(null);
    const [filteredDataSubmissions, setFilteredDataSubmissions] = useState(null);
    const handleFilterData = (data) => {
        setFilteredData(data);
    };

    return (
        <div className={cx('dashboardContainer')}>
            <div className={cx('statsGrid')}>
                <div className={cx('statCard')}>
                    <h3>Total Users</h3>
                    <DateFilterUser onFilterData={handleFilterData} />
                    {filteredDataUser && (
                        <div>
                            <h2>Filtered Users:</h2>
                            <pre>{JSON.stringify(filteredDataUser, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('statCard')}>
                <h3>Total Submissions</h3>
                <DateFilterSubmissions onFilterSubmissions={setFilteredDataSubmissions} />
                {filteredDataSubmissions && (
                    <div>
                        <h2>Filtered Submissions:</h2>
                        <pre>{JSON.stringify(filteredDataSubmissions, null, 2)}</pre>
                    </div>
                )}
                <p></p>
            </div>
            <div className={cx('statCard')}>
                <h3>Active Subscriptions</h3>
                <p></p>
            </div>
            <div className={cx('statCard')}>
                <h3>Pending Requests</h3>
                <p></p>
            </div>
        </div>
    );
}
export default Dashboard;
