import { AdminLayout } from '~/layouts';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ProblemManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProblemUpdate from '../ProblemUpdate';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const cx = classNames.bind(styles);
function ProblemsManagement() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState({
        ProblemTitle: '',
        ProblemCategory: '',
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
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [query]);
    const fetchProblems = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            const response = await axios.get('http://localhost:5180/api/problemManagement', {
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
    const handleEdit = (id) => {
        console.log('Edit problem:', id);
    };
    const handleDelete = async (problemId) => {
        try {
            const requestData = { problemId };
            await axios.delete(
                `http://localhost:5180/api/problemManagement/delete?problemId=${problemId}`,
            );
            fetchProblems();
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };
    return (
        <AdminLayout>
            <div className={cx('content')}>
                <h2>Danh sách bài tập</h2>
                <div className={cx('top-bar')}>
                    <input
                        type="text"
                        name="ProblemTitle"
                        placeholder="Tìm kiếm theo tên"
                        value={query.ProblemTitle}
                        onChange={handleChange}
                    />
                    <button className={cx('create-btn')} onClick={() => navigate('/ProblemForm')}>
                        Tạo bài tập mới
                    </button>
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
                            <th>Edit</th>
                            <th>Delete</th>
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
                                        onClick={() =>
                                            navigate('/problemupdate', { state: { problem } })
                                        }
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={cx('delete-btn')}
                                        onClick={() => handleDelete(problem.problemId)}
                                    >
                                        Delete
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
export default ProblemsManagement;
