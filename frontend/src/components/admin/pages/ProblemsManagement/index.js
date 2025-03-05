import { AdminLayout } from '~/layouts';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProblemManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const cx = classNames.bind(styles);
function ProblemsManagement() {
    const [problems, setProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 4;

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await axios.get('https://your-backend-url/api/problems');
            setProblems(response.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEdit = (id) => {
        console.log('Edit problem:', id);
        // Implement edit functionality
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://your-backend-url/api/problems/${id}`);
            setProblems(problems.filter((problem) => problem.id !== id));
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };

    const filteredProblems = problems.filter((problem) =>
        problem.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <AdminLayout>
            <div className={cx('content')}>
                <h2>Danh sách bài tập</h2>
                <div className={cx('top-bar')}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className={cx('create-btn')}>Tạo bài tập mới</button>
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
                        {currentProblems.map((problem) => (
                            <tr key={problem.id}>
                                <td>{problem.id}</td>
                                <td>{problem.name}</td>
                                <td>{problem.status}</td>
                                <td>{problem.completion}%</td>
                                <td>{problem.totalCompleted}</td>
                                <td>{problem.score}</td>
                                <td>
                                    <button
                                        className={cx('edit-btn')}
                                        onClick={() => handleEdit(problem.id)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={cx('delete-btn')}
                                        onClick={() => handleDelete(problem.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={cx('pagination')}>
                    {Array.from(
                        { length: Math.ceil(filteredProblems.length / problemsPerPage) },
                        (_, i) => (
                            <button
                                key={i}
                                className={currentPage === i + 1 ? 'active' : ''}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ),
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
export default ProblemsManagement;
