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
    const [contest, setContest] = useState([]);
    useEffect(() => {
        fetchContests();
        fetchTotalUser();
        fetchTotalSubmissions();
        fetchTotalProblems();
    }, []);

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
                    <DateFilterUser />
                </div>
                <div className={cx('statCard')}>
                    <h3>Tổng số bài nộp: {totalSubmissions}</h3>
                    <DateFilterSubmissions />
                </div>
                <div className={cx('statCard')}>
                    <h3>TỔng số bài tập: {totalProblems}</h3>
                    <ProblemFilter />
                </div>

                <h3>Cuộc thi mới nhất</h3>
                {contest !== undefined &&
                    contest.map((contest, i) => <ContestDashboard key={i} contest={contest} />)}
            </div>
        </AdminLayout>
    );
}

export default Dashboard;
