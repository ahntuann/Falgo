import React, { useEffect, useState, useRef, useContext } from 'react';
import AuthContext from '~/context/AuthContext';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './Problems.module.scss';

import classNames from 'classnames/bind';

import style from './Problems.module.scss';

const cs = classNames.bind(style);

const ProblemList = () => {
    const { appUser } = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProblems, setTotalProblems] = useState([]);
    const [query, setQuery] = useState({
        ProblemTitle: '',
        ProblemCategory: '',
        HidePassed: false,
        SortBy: '',
        IsDescending: false,
        PageNumber: 1,
        PageSize: 15,
        UserId: appUser?.id || '',
    });

    const categoryColorMap = {};

    const getCategoryColor = (category) => {
        if (!category) return '#A9A9A9';

        if (!categoryColorMap[category]) {
            const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hue = hash % 360;
            categoryColorMap[category] = `hsl(${hue}, 70%, 50%)`;
        }

        return categoryColorMap[category];
    };

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

            const response = await axios.get('http://localhost:5180/api/problem', {
                params: filteredQuery,
            });
            setTotalProblems(response.data.totalItems);
            setProblems(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching problems', error);
        }
    };

    const handleSortByTitle = () => {
        setQuery((prevQuery) => {
            const sortOrder = ['', 'n1', 'n2'];
            const currentIndex = sortOrder.indexOf(prevQuery.SortBy);
            const nextIndex = (currentIndex + 1) % sortOrder.length;
            return { ...prevQuery, SortBy: sortOrder[nextIndex] };
        });
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
        <div className={cs('problemList')}>
            <h2>Danh sách bài tập ({totalProblems} câu hỏi)</h2>
            <div className={cs('filters')}>
                <input
                    type="text"
                    name="ProblemTitle"
                    placeholder="Tìm kiếm theo tên/mã"
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
                        <th>Mã bài</th>
                        <th onClick={handleSortByTitle} style={{ cursor: 'pointer' }}>
                            Tên
                            <span style={{ marginLeft: '5px' }}>
                                <span
                                    style={{ color: query.SortBy === 'n1' ? '#00cc00' : '#A9A9A9' }}
                                >
                                    ▲
                                </span>
                                <span
                                    style={{ color: query.SortBy === 'n2' ? '#00cc00' : '#A9A9A9' }}
                                >
                                    ▼
                                </span>
                            </span>
                        </th>
                        <th>Dạng bài</th>
                        <th>Tỉ lệ hoàn thành</th>
                        <th>Tổng số bài hoàn thành</th>
                        <th>Điểm</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((problem, i) => (
                        <tr key={i}>
                            <td
                                style={{
                                    color: '##9370DB',
                                    fontWeight: 'bold',
                                }}
                            >
                                {problem.problemId}
                            </td>
                            <td>
                                <Link
                                    to={`/problems/${problem.problemId}`}
                                    style={{
                                        color: '##9370DB',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {problem.title}
                                </Link>
                            </td>
                            <td
                                style={{
                                    color: getCategoryColor(problem.category),
                                    fontWeight: 'bold',
                                }}
                            >
                                {problem.category}
                            </td>
                            <td>{problem.acceptanceRate}%</td>
                            <td>{problem.acceptedCount}</td>
                            <td>{problem.score}</td>
                            <td
                                style={{
                                    color:
                                        problem.solvedStatus === 'Not passed'
                                            ? '#ff3333'
                                            : '#00cc00',
                                    fontWeight: 'bold',
                                }}
                            >
                                {problem.solvedStatus === 'Not passed'
                                    ? 'Chưa hoàn thành'
                                    : 'Đã hoàn thành'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={cs('pagination')}>
                <button
                    disabled={query.PageNumber === 1}
                    onClick={() => setQuery({ ...query, PageNumber: query.PageNumber - 1 })}
                >
                    &lt;
                </button>

                {query.PageNumber > 3 && (
                    <>
                        <button onClick={() => setQuery({ ...query, PageNumber: 1 })}>1</button>
                        <span className={cs('dots')}>...</span>
                    </>
                )}

                {Array.from({ length: 5 }, (_, i) => query.PageNumber - 2 + i)
                    .filter((page) => page >= 1 && page <= totalPages)
                    .map((page) => (
                        <button
                            key={page}
                            className={page === query.PageNumber ? cs('active') : ''}
                            onClick={() => setQuery({ ...query, PageNumber: page })}
                        >
                            {page}
                        </button>
                    ))}

                {query.PageNumber < totalPages - 2 && (
                    <>
                        <span className={cs('dots')}>...</span>
                        <button onClick={() => setQuery({ ...query, PageNumber: totalPages })}>
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    disabled={query.PageNumber === totalPages}
                    onClick={() => setQuery({ ...query, PageNumber: query.PageNumber + 1 })}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default ProblemList;
