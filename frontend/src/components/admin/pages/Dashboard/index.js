import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './dashboard.module.scss';
import { DateFilterUser, DateFilterSubmissions } from '~/components/admin/components';
import dayjs from 'dayjs';
import { AdminLayout } from '~/layouts';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProblemFilter from '../../components/ProblemFilter';
const cx = classNames.bind(styles);

function Dashboard() {
    const navigate = useNavigate();
    const [filteredDataUser, setFilteredData] = useState(null);
    const [filteredDataSubmissions, setFilteredDataSubmissions] = useState(null);
    const [totalUser, setTotalUser] = useState();
    const [totalSubmissions, setTotalSubmissions] = useState();
    const [totalProblems, setTotalProblems] = useState();
    useEffect(() => {
        fetchTotalUser();
        console.log(totalUser);
    }, []);
    useEffect(() => {
        fetchTotalSubmissions();
    }, []);
    // useEffect(() => {
    //   fetchTotalProblems();
    //   }, []);
    const handleFilterData = (data) => {
        setFilteredData(data);
    };
    const role = JSON.parse(sessionStorage.getItem('admin'));
    useEffect(() => {
        if (role == null) {
            navigate('/');
            console.log(role);
        }
    }, [role]);
    const fetchTotalUser = async () => {
        try {
            const response = await axios.get('http://localhost:5180/api/AdminDashboard/totalUser');
            setTotalUser(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };
    const fetchTotalSubmissions = async () => {
        try {
            const response = await axios.get('http://localhost:5180/api/AdminDashboard/totalSub');
            setTotalSubmissions(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };
    /*const fetchTotalProblems = async () => {
        try {
            const response = await axios.get('http://localhost:5180/api/AdminDashboard/totalProb');
            setTotalProblems(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };*/

    return (
        <AdminLayout sidebar="active">
            <div className={cx('dashboardContainer')}>
                <div className={cx('statsGrid')}>
                    <div className={cx('statCard')}>
                        <h3>Total Users: {totalUser}</h3>
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
                    <h3>Total Submissions : {totalSubmissions}</h3>
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
                    <ProblemFilter></ProblemFilter>
                </div>
                <div className={cx('statCard')}>
                    <h3>Pending Requests</h3>
                    <p></p>
                </div>
            </div>
        </AdminLayout>
    );
}
export default Dashboard;
