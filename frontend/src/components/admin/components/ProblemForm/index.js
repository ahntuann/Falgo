import './ProblemForm.Module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { AdminLayout } from '~/layouts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProblemForm = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'], // "image" can be removed if not needed
        ],
    };
    const role = JSON.parse(sessionStorage.getItem('admin'));
    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role]);
    const [problem, setProblem] = useState({
        problemId: '',
        category: '',
        title: '',
        detail: '',
        input: '',
        output: '',
        totalPoint: 0,
        timeLimit: 0,
        memoryLimit: 0,
        author: '',
        solution: '',
    });

    const [testCases, setTestCases] = useState(
        Array.from({ length: 10 }, (_, index) => ({
            testCaseName: `Test Case ${index + 1}`,
            input: '',
            output: '',
        })),
    );

    const handleChange = (e) => {
        setProblem({ ...problem, [e.target.name]: e.target.value });
    };

    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = [...testCases];
        updatedTestCases[index][field] = value;
        setTestCases(updatedTestCases);
    };

    const handleSubmit = async () => {
        const requestData = {
            problem: {
                problemId: problem.problemId,
                category: problem.category,
                title: problem.title,
                detail: problem.detail,
                input: problem.input,
                output: problem.output,
                totalPoint: problem.totalPoint,
                timeLimit: problem.timeLimit,
                memoryLimit: problem.memoryLimit,
                author: problem.author,
                solution: problem.solution,
            },

            testcase: testCases.map((tc, index) => ({
                testCaseName: `Test Case ${index + 1}`, // Assigns a name for each test case
                input: tc.input,
                output: tc.output,
            })),
        };
        try {
            console.log(problem);

            const response = await axios.post(
                'http://localhost:5180/api/problemManagement/create',
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <AdminLayout>
            <div className="problem-container">
                <div className="problem-form">
                    <input
                        type="text"
                        name="problemId"
                        placeholder="ID"
                        value={problem.problemId}
                        onChange={handleChange}
                        required
                    />
                    <h2>Mô tả bài toán</h2>
                    <ReactQuill
                        modules={modules}
                        value={problem.detail}
                        onChange={(value) => setProblem({ ...problem, detail: value })}
                        placeholder="Viết mô tả bài toán ở đây"
                        rows={10}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        required
                    />

                    <h2>Lời giải</h2>
                    <ReactQuill
                        value={problem.solution}
                        onChange={(value) => setProblem({ ...problem, solution: value })}
                        placeholder="Viết lời giải bài toán ở đây"
                        rows={10}
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        required
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Đề bài"
                        value={problem.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Thể loại"
                        value={problem.category}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="input"
                        placeholder="Input"
                        value={problem.input}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="output"
                        placeholder="Output"
                        value={problem.output}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="totalPoint"
                        placeholder="Điểm tối đa"
                        value={problem.totalPoint}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="timeLimit"
                        placeholder="Time Limit (ms)"
                        value={problem.timeLimit}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="memoryLimit"
                        placeholder="Memory Limit (MB)"
                        value={problem.memoryLimit}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Người đăng (optional)"
                        value={problem.author}
                        onChange={handleChange}
                        required
                    />

                    <h3>Test Cases</h3>
                    {testCases.map((test, index) => (
                        <div key={index} className="test-case">
                            <input
                                type="text"
                                placeholder={`Test Case ${index + 1} Input`}
                                value={test.input}
                                onChange={(e) =>
                                    handleTestCaseChange(index, 'input', e.target.value)
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder={`Test Case ${index + 1} Output`}
                                value={test.output}
                                onChange={(e) =>
                                    handleTestCaseChange(index, 'output', e.target.value)
                                }
                                required
                            />
                        </div>
                    ))}

                    <button onClick={handleSubmit} className="submit-btn">
                        Tạo bài
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProblemForm;
