import './ProblemUpdate.Module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AdminLayout } from '~/layouts';

const ProblemUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [problem, setProblem] = useState(location.state?.problem || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [testCases, setTestCases] = useState(
        Array.from({ length: 10 }, (_, index) => ({
            testCaseName: `Test Case ${index + 1}`,
            input: '',
            output: '',
        })),
    );
    const role = JSON.parse(sessionStorage.getItem('admin'));
    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role]);
    const handleChange = (e) => {
        setProblem({ ...problem, [e.target.name]: e.target.value });
    };
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const requestData = {
            problem: {
                ...problem,
            },
            testcase: testCases,
        };

        try {
            const response = await axios.put(
                `http://localhost:5180/api/problemManagement/update`,
                problem,
            );
            navigate('/ProblemsManagement');
        } catch (error) {
            console.error('Error:', error);
            setError('Có lỗi xảy ra khi cập nhật.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="problem-container">
                <div className="problem-form">
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <input
                        type="text"
                        name="problemId"
                        placeholder="ID"
                        value={problem.problemId}
                        onChange={handleChange}
                        disabled={!!problem} // Disable ID field when updating
                    />
                    <h2>Mô tả bài toán</h2>
                    <textarea
                        value={problem.detail}
                        onChange={(e) => setProblem({ ...problem, detail: e.target.value })}
                        placeholder="Viết mô tả bài toán ở đây"
                        rows={10}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                    <h2>Lời giải</h2>
                    <textarea
                        value={problem.solution}
                        onChange={(e) => setProblem({ ...problem, solution: e.target.value })}
                        placeholder="Viết lời giải bài toán ở đây"
                        rows={10}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Đề bài"
                        value={problem.title}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Thể loại"
                        value={problem.category}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="input"
                        placeholder="Input"
                        value={problem.input}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="output"
                        placeholder="Output"
                        value={problem.output}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="totalPoint"
                        placeholder="Điểm tối đa"
                        defaultValue={problem.score}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="timeLimit"
                        placeholder="Time Limit (ms)"
                        value={problem.timeLimit}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="memoryLimit"
                        placeholder="Memory Limit (MB)"
                        value={problem.memoryLimit}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Người đăng (optional)"
                        value={problem.author}
                        onChange={handleChange}
                    />

                    <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
                        Cập Nhật
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProblemUpdate;
