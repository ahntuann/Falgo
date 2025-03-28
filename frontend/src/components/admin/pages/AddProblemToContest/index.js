import { AdminLayout } from '~/layouts';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AddProblemToContest.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProblemUpdate from '../ProblemUpdate';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const cx = classNames.bind(styles);
function AddProblemToContest() {
    const role = JSON.parse(sessionStorage.getItem('admin'));
    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role]);
    const navigate = useNavigate();
    const location = useLocation();
    const [contest, setContest] = useState(location.state?.contest || {});
    const [problems, setProblems] = useState([]);
    const [AddedProblems, setAddedProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState({
        ContestId: contest.contestId,
        ProblemTitle: '',
        ProblemId: '',
        PageNumber: 1,
        PageSize: 15,
    });

    const debounceRef = useRef(null);
    useEffect(() => {
        fetchCategories();
    }, []);
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchProblems();
            fetchAddedProblems();
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [query]);
    const fetchAddedProblems = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            console.log(fetchProblems);
            const response = await axios.get('http://localhost:5180/api/ContestProblem/Added', {
                params: filteredQuery,
            });
            setAddedProblems(response.data.items);
            console.log(AddedProblems);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching problems', error);
        }
    };
    const fetchProblems = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            const response = await axios.get('http://localhost:5180/api/ContestProblem/Exist', {
                params: filteredQuery,
            });
            setProblems(response.data.items);
            console.log(problems);

            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching problems', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5180/api/problemManagement/categories',
            );
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };
    const handleChange = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value });
    };
    const handleAdd = async (problemId) => {
        const updatedQuery = { ...query, ProblemId: problemId };
        setQuery(updatedQuery);

        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(updatedQuery).filter(([_, value]) => value !== ''),
            );
            console.log(filteredQuery);
            await axios.get('http://localhost:5180/api/ContestProblem/Add', {
                params: filteredQuery,
            });

            fetchProblems();
            fetchAddedProblems();
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };
    const handleDelete = async (problemId) => {
        const updatedQuery = { ...query, ProblemId: problemId };
        setQuery(updatedQuery);

        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(updatedQuery).filter(([_, value]) => value !== ''),
            );

            await axios.get('http://localhost:5180/api/ContestProblem/Delete', {
                params: filteredQuery,
            });
            fetchProblems();
            fetchAddedProblems();
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };
    return (
        <AdminLayout>
            <div className={cx('content')}>
                <h2>Cuộc thi :{contest.contestName}</h2>
                <h2>Danh sách bài tập đã thêm</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Mã Câu hỏi</th>
                            <th>Tên</th>
                            <th>Dang câu hỏi</th>
                            <th>Tỉ lệ hoàn thành</th>
                            <th>Tổng số bài hoàn thành</th>
                            <th>Điểm</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AddedProblems.map((AddedProblems, i) => (
                            <tr key={i}>
                                <td>{AddedProblems.problemId}</td>
                                <td>
                                    <ReactQuill
                                        value={AddedProblems.title}
                                        readOnly={true}
                                        theme="bubble"
                                    />
                                </td>
                                <td>{AddedProblems.category}</td>
                                <td>{AddedProblems.acceptanceRate}%</td>
                                <td>{AddedProblems.acceptedCount}</td>
                                <td>{AddedProblems.score}</td>
                                <td>
                                    <button
                                        className={cx('delete-btn')}
                                        onClick={() => handleDelete(AddedProblems.problemId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h2>Danh sách bài tập chưa được thêm</h2>
                <div className={cx('top-bar')}>
                    <input
                        type="text"
                        name="ProblemTitle"
                        placeholder="Tìm kiếm theo tên"
                        value={query.ProblemTitle}
                        onChange={handleChange}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Mã Câu hỏi</th>
                            <th>Tên</th>
                            <th>Dang câu hỏi</th>
                            <th>Tỉ lệ hoàn thành</th>
                            <th>Tổng số bài hoàn thành</th>
                            <th>Điểm</th>
                            <th>Add</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem, i) => (
                            <tr key={i}>
                                <td>{problem.problemId}</td>
                                <td>
                                    <ReactQuill
                                        value={problem.title}
                                        readOnly={true}
                                        theme="bubble"
                                    />
                                </td>
                                <td>{problem.category}</td>
                                <td>{problem.acceptanceRate}%</td>
                                <td>{problem.acceptedCount}</td>
                                <td>{problem.score}</td>
                                <td>
                                    <button
                                        className={cx('edit-btn')}
                                        onClick={() => handleAdd(problem.problemId)}
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
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
            </div>
        </AdminLayout>
    );
}
export default AddProblemToContest;
