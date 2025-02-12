import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './dashboard.module.scss';
import { DateFilter } from '~/components/admin/components';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function Dashboard() {
    const userType = 'user';
    const [filteredData, setFilteredData] = useState(null);

    const handleFilterData = (data) => {
        setFilteredData(data);
    };

    return (
        <div className={cx('dashboardContainer')}>
            <div className={cx('statsGrid')}>
                <div className={cx('statCard')}>
                    <h3>Total Users</h3>
                    <DateFilter onFilterData={handleFilterData} Type={userType} />
                    <p></p>
                    {filteredData && (
                        <div>
                            <h2>Filtered Users:</h2>
                            <pre>{JSON.stringify(filteredData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('statCard')}>
                <h3>Total Revenue</h3>
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
