import { AdminLayout } from '~/layouts';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ContestManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import ContestDashboard from '../../components/ContestShowDashboard';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const cx = classNames.bind(styles);

function ContestManagement() {
    useEffect(() => {
        fetchContests();
    }, []);
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState({
        ContestTitle: '',
        ContestId: '',
        PageNumber: 1,
        PageSize: 15,
    });
    const [contest, setContest] = useState([]);
    const handleChange = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value });
    };
    const handleUpdate = (id) => {
        console.log('Edit problem:', id);
        navigate('/AddProblemToContest', { state: { contest } });
    };

    const handleDelete = async (contestId) => {
        const isConfirmed = window.confirm('Bạn có chắc muốn xóa cuộc thi này không?');

        if (!isConfirmed) return; // If user cancels, stop execution

        try {
            await axios.delete(
                `http://localhost:5180/api/ContestManagement/delete?contestId=${contestId}`,
            );
            fetchContests();
        } catch (error) {
            console.error('lỗi khi xóa contest:', error);
        }
    };
    const debounceRef = useRef(null);
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchContests();
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [query]);
    const fetchContests = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            const response = await axios.get('http://localhost:5180/api/ContestManagement', {
                params: filteredQuery,
            });
            console.log(filteredQuery);

            //if (!response.ok) throw new Error('No contests found');
            //    const data = await response.json();
            setContest(response.data.items);
            console.log(response.data);
            setTotalPages(response.data.totalPages);
            console.log(response.data);
        } catch (error) {}
    };
    return (
        <AdminLayout>
            <div>
                <h2>Quản lý cuộc thi</h2>
            </div>
            <div className={cx('top-bar')}>
                <input
                    type="text"
                    name="ContestTitle"
                    placeholder="Tìm kiếm theo tên"
                    value={query.ContestTitle}
                    onChange={handleChange}
                />
                <button className={cx('create-btn')} onClick={() => navigate('/AddContest')}>
                    Tạo Cuộc thi mới
                </button>
            </div>
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
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {contest !== undefined &&
                        contest.map((contest, i) => (
                            <tr>
                                <td>{contest.contestId}</td>
                                <td>
                                    <ReactQuill
                                        value={contest.contestName}
                                        readOnly={true}
                                        theme="bubble"
                                    />
                                </td>
                                <td>{contest.dueTime}</td>
                                <td>{contest.totalPoint}</td>
                                <td>{contest.level}</td>
                                <td>{new Date(contest.endDate).toLocaleString()}</td>
                                <td>{contest.numRegis}</td>
                                <td>
                                    <button
                                        className={cx('edit-btn')}
                                        onClick={() =>
                                            navigate('/AddProblemToContest', { state: { contest } })
                                        }
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={cx('delete-btn')}
                                        onClick={() => handleDelete(contest.contestId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}{' '}
                </tbody>
            </table>
            <div className={cx('pagination')}>
                <button
                    disabled={query.PageNumber === 1}
                    onClick={() => setQuery({ ...query, PageNumber: query.PageNumber - 1 })}
                >
                    Trước
                </button>
                <span>
                    Trang {query.PageNumber} trong {totalPages}
                </span>
                <button
                    disabled={query.PageNumber === totalPages}
                    onClick={() => setQuery({ ...query, PageNumber: query.PageNumber + 1 })}
                >
                    Sau
                </button>
            </div>
        </AdminLayout>
    );
}
export default ContestManagement;
