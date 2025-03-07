import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './dashboard.module.scss';
import { AdminLayout } from '~/layouts';
import { useNavigate } from 'react-router-dom';
import ProblemFilter from '../../components/ProblemFilter';
import { DateFilterSubmissions, DateFilterUser } from '../../components';
import ContestDashboard from '../../components/ContestShowDashboard';
const cx = classNames.bind(styles);

function Dashboard() {
    const navigate = useNavigate();
    const [totalUser, setTotalUser] = useState();
    const [totalSubmissions, setTotalSubmissions] = useState();
    const [totalProblems, setTotalProblems] = useState();
    const [filteredDataUser, setFilteredData] = useState(null);
    const [filteredDataSubmissions, setFilteredDataSubmissions] = useState(null);
    const [contest, setContest] = useState([]);
    useEffect(() => {
        fetchContests();
        fetchTotalUser();
        fetchTotalSubmissions();
        fetchTotalProblems();
    }, []);
    const handleFilterData = (data) => {
        setFilteredData(data);
    };
    const role = JSON.parse(sessionStorage.getItem('admin'));
    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role]);
    const fetchContests = async () => {
        try {
            const response = await fetch('http://localhost:5180/api/AdminDashboard/contest');
            if (!response.ok) throw new Error('No contests found');
            const data = await response.json();

            if (data && Array.isArray(data)) {
                setContest(data);
                console.log(data);
            }
        } catch (error) {}
    };
    const fetchTotalUser = async () => {
        try {
            const response = await fetch('http://localhost:5180/api/AdminDashboard/totalUser');
            if (!response.ok) throw new Error('Failed to fetch total users');
            const data = await response.json();
            setTotalUser(data);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };

    const fetchTotalSubmissions = async () => {
        try {
            const response = await fetch('http://localhost:5180/api/AdminDashboard/totalSub');
            if (!response.ok) throw new Error('Failed to fetch submissions');
            const data = await response.json();
            setTotalSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions:', error.message);
        }
    };

    const fetchTotalProblems = async () => {
        try {
            const response = await fetch('http://localhost:5180/api/AdminDashboard/totalProb');
            if (!response.ok) throw new Error('Failed to fetch problems');
            const data = await response.json();
            setTotalProblems(data);
        } catch (error) {
            console.error('Error fetching problems:', error.message);
        }
    };

    return (
        <AdminLayout sidebar="active">
            <div className={cx('dashboardContainer')}>
                <div className={cx('statCard')}>
                    <h3>Tống số người dùng: {totalUser}</h3>
                    <DateFilterUser onFilterData={handleFilterData} />
                    {filteredDataUser && (
                        <div>
                            <h2>Số người dùng đã lọc:</h2>
                            <pre>{JSON.stringify(filteredDataUser, null, 2)}</pre>
                        </div>
                    )}

                    <h3>Tổng số bài nộp: {totalSubmissions}</h3>
                    <DateFilterSubmissions onFilterSubmissions={setFilteredDataSubmissions} />
                    {filteredDataSubmissions && (
                        <div>
                            <h2>Bài nộp đã lọc:</h2>
                            <pre>{JSON.stringify(filteredDataSubmissions, null, 2)}</pre>
                        </div>
                    )}
                </div>
                <div className={cx('statCard')}>
                    <h3>TỔng số bài tập: {totalProblems}</h3>
                    <ProblemFilter />
                </div>
                <h3>Cuộc thi mới nhất</h3>
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
                        {contest !== undefined &&
                            contest.map((contest, i) => (
                                <tr>
                                    <td>{contest.contestId}</td>
                                    <td>{contest.contestName}</td>
                                    <td>{contest.dueTime}</td>
                                    <td>{contest.totalPoint}</td>
                                    <td>{contest.level}</td>
                                    <td>{new Date(contest.endDate).toLocaleString()}</td>
                                    <td>{contest.numRegis}</td>
                                </tr>
                            ))}{' '}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;
