import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Problems.module.scss';

const ProblemList = () => {
    const [problems, setProblems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState({
        ProblemTitle: '',
        ProblemCategory: '',
        HidePassed: false,
        SortBy: '',
        IsDescending: false,
        PageNumber: 1,
        PageSize: 15,
    });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProblems();
        fetchCategories();
    }, [query]);

    const fetchProblems = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );

            const response = await axios.get('http://localhost:5180/api/problem', {
                params: filteredQuery,
            });
            setProblems(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching problems', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5180/api/problem/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleChange = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value });
    };

    return (
        <div className="problem-list">
            <h2>Danh sách câu hỏi</h2>
            <div className="filters">
                <input
                    type="text"
                    name="ProblemTitle"
                    placeholder="Tìm kiếm theo tên"
                    value={query.ProblemTitle}
                    onChange={handleChange}
                />
                <select
                    name="ProblemCategory"
                    value={query.ProblemCategory}
                    onChange={handleChange}
                >
                    <option value="">Tất cả các dạng</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <label>
                    <input
                        type="checkbox"
                        name="HidePassed"
                        checked={query.HidePassed}
                        onChange={() => setQuery({ ...query, HidePassed: !query.HidePassed })}
                    />
                    Ẩn bài đã hoàn thành
                </label>
                <select name="SortBy" value={query.SortBy} onChange={handleChange}>
                    <option value="">Sắp xếp theo</option>
                    <option value="ar">Tỉ lệ hoàn thành</option>
                    <option value="ac">Tổng số bài hoàn thành</option>
                    <option value="p">Điểm</option>
                </select>
                <button onClick={() => setQuery({ ...query, IsDescending: !query.IsDescending })}>
                    {query.IsDescending ? 'Giảm dần' : 'Tăng dần'}
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Dạng câu hỏi</th>
                        <th>Tỉ lệ hoàn thành</th>
                        <th>Tổng số bài hoàn thành</th>
                        <th>Điểm</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((problem) => (
                        <tr key={problem.id}>
                            <td>{problem.title}</td>
                            <td>{problem.category}</td>
                            <td>{problem.acceptanceRate}%</td>
                            <td>{problem.acceptedCount}</td>
                            <td>{problem.score}</td>
                            <td>{problem.solvedStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
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
    );
};

export default ProblemList;
