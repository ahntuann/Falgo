import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './UserProfileBlog.module.scss';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import { useContext } from 'react';
import AuthContext from '~/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const cs = classNames.bind(styles);

const UserProfileBlog = () => {
    const navigate = useNavigate();
    const { userRole } = useContext(AuthContext);
    const userNow = localStorage.getItem('user');
    const userObject = userNow ? JSON.parse(userNow) : null;

    const [originalBlogs, setOriginalBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    const [categories] = useState([
        'Mẹo lập trình',
        'Hướng dẫn',
        'Xu hướng lập trình',
        'Kinh Nghiệm',
        'Thử thách',
    ]);
    const StatusOptions = ['Chờ duyệt', 'Duyệt Lại', 'Thông qua', 'Từ chối', 'Báo cáo'];
    const [query, setQuery] = useState({
        search: '',
        category: '',
        status: '',
        sortBy: 'createOn',
        IsDescending: true,
        page: 1,
        postsPerPage: 10,
        dateFilter: '',
    });

    const startIndex = (query.page - 1) * query.postsPerPage;
    const endIndex = startIndex + query.postsPerPage;
    const userBlogs = filteredBlogs.filter((blog) => blog.userId === userObject.id);
    const totalPages = Math.ceil(userBlogs.length / query.postsPerPage);
    const paginatedBlogs = userBlogs.slice(startIndex, endIndex);
    const debounceRef = useRef(null);

    const [dateFilter, setDateFilter] = useState({
        day: '',
        month: '',
        year: '',
    });

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchBlogs();
        }, 1000);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    useEffect(() => {
        handleFilterByDate();
    }, [dateFilter, originalBlogs]);

    useEffect(() => {
        setFilteredBlogs((prevBlogs) =>
            [...prevBlogs].sort((a, b) => {
                if (query.sortBy === 'createOn') {
                    return query.IsDescending
                        ? new Date(b.createOn) - new Date(a.createOn)
                        : new Date(a.createOn) - new Date(b.createOn);
                } else if (query.sortBy === 'title') {
                    return query.IsDescending
                        ? b.title.localeCompare(a.title)
                        : a.title.localeCompare(b.title);
                } else if (query.sortBy === 'status') {
                    return query.IsDescending
                        ? b.status.localeCompare(a.status)
                        : a.status.localeCompare(b.status);
                }
                return 0;
            }),
        );
    }, [query.sortBy, query.IsDescending]);

    const fetchBlogs = async () => {
        try {
            const params = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            const response = await axios.get('http://localhost:5180/api/BlogController', {
                params,
            });

            let fetchedBlogs = response.data || [];

            if (query.category) {
                fetchedBlogs = fetchedBlogs.filter((blog) => {
                    if (!blog.categoryBlog) return false;
                    const categoriesArray = blog.categoryBlog.split(',').map((cat) => cat.trim());
                    return categoriesArray.includes(query.category);
                });
            }

            if (query.search) {
                const searchLower = query.search.toLowerCase();
                fetchedBlogs = fetchedBlogs.filter(
                    (blog) =>
                        blog.title.toLowerCase().includes(searchLower) ||
                        blog.description.toLowerCase().includes(searchLower) ||
                        blog.categoryBlog.toLowerCase().includes(searchLower),
                );
            }

            if (query.status) {
                fetchedBlogs = fetchedBlogs.filter((blog) => blog.status === query.status);
            }

            fetchedBlogs = fetchedBlogs.sort((a, b) => {
                if (query.sortBy === 'createOn') {
                    return query.IsDescending
                        ? new Date(b.createOn) - new Date(a.createOn)
                        : new Date(a.createOn) - new Date(b.createOn);
                } else if (query.sortBy === 'title') {
                    return query.IsDescending
                        ? b.title.localeCompare(a.title)
                        : a.title.localeCompare(b.title);
                } else if (query.sortBy === 'status') {
                    return query.IsDescending
                        ? b.status.localeCompare(a.status)
                        : a.status.localeCompare(b.status);
                }
                return 0;
            });

            setOriginalBlogs(fetchedBlogs);
            setFilteredBlogs(fetchedBlogs);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu blog:', error);
            setOriginalBlogs([]);
            setFilteredBlogs([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuery((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCategoryChange = (category) => {
        setQuery((prev) => ({
            ...prev,
            category: prev.category === category ? '' : category,
        }));
    };

    const handleReset = () => {
        setQuery({
            search: '',
            category: '',
            sortBy: 'createOn',
            IsDescending: false,
            page: 1,
            postsPerPage: 10,
            dateFilter: '',
        });

        setDateFilter({ day: '', month: '', year: '' });
        setFilteredBlogs(originalBlogs);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilterByDate = () => {
        const { day, month, year } = dateFilter;

        const filtered = originalBlogs.filter((blog) => {
            const blogDate = new Date(blog.createOn);
            const blogDay = blogDate.getDate();
            const blogMonth = blogDate.getMonth() + 1;
            const blogYear = blogDate.getFullYear();

            return (
                (year ? blogYear === Number(year) : true) &&
                (month ? blogMonth === Number(month) : true) &&
                (day ? blogDay === Number(day) : true)
            );
        });

        setFilteredBlogs(filtered);
    };

    const handleDelete = async (blogId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:5180/api/BlogController/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (response.status === 401) {
                alert('Bạn cần đăng nhập để xóa bài viết!');
                return;
            }

            const text = await response.text();

            if (response.ok) {
                alert('Xóa bài viết thành công!');
                setFilteredBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
            } else {
                alert(`Xóa thất bại! Server trả về: ${text}`);
            }
        } catch (error) {
            console.error('Lỗi khi xóa bài viết:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setQuery((prev) => ({ ...prev, page: newPage }));
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, query.page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={cs(i === query.page ? 'current-page' : 'page-btn')}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>,
            );
        }
        return pageNumbers;
    };

    const toggleSortDirection = () => {
        setQuery((prev) => ({ ...prev, IsDescending: !prev.IsDescending }));
    };

    return (
        <div className={cs('profilePage')}>
            <div className={cs('profile-container')}>
                {/* Profile Header - Matching the Profile component */}
                <div className={cs('profile-header')}>
                    <div className={cs('nav-tabs')}>
                        <button className={cs('nav-tab')} onClick={() => navigate('/profile')}>
                            Hồ sơ cá nhân
                        </button>
                        <button
                            className={cs('nav-tab')}
                            onClick={() => navigate('/updateprofile')}
                        >
                            Chỉnh sửa hồ sơ
                        </button>
                        <button className={cs('nav-tab', 'active')}>Bài viết</button>
                        <button
                            className={cs('nav-tab')}
                            onClick={() => navigate('/usersubmissions')}
                        >
                            Bài nộp
                        </button>
                        <button className={cs('nav-tab')} onClick={() => navigate('/usercontest')}>
                            Cuộc thi
                        </button>
                    </div>
                </div>

                <div className={cs('profile-content')}>
                    <div className={cs('blog-content')}>
                        <div className={cs('blog-header')}>
                            <h2 className={cs('title')}>Bài viết của tôi</h2>
                            <div className={cs('search-bar')}>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Tìm kiếm bài viết..."
                                    value={query.search}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={cs('blog-main-content')}>
                            <div className={cs('blog-list')}>
                                {paginatedBlogs.length > 0 ? (
                                    paginatedBlogs.map((blog) => (
                                        <div key={blog.id} className={cs('blog-item')}>
                                            <img
                                                src={blog.thumbnail ? blog.thumbnail : NoImage}
                                                alt={blog.title}
                                                className={cs('thumbnail')}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = NoImage;
                                                }}
                                            />

                                            <div className={cs('content')}>
                                                <h2>{blog.title}</h2>
                                                <p>{blog.description}</p>
                                                {blog.categoryBlog &&
                                                    blog.categoryBlog.trim() !== '' &&
                                                    blog.categoryBlog.trim() !== ',' && (
                                                        <div className={cs('category-tags')}>
                                                            {blog.categoryBlog
                                                                .split(',')
                                                                .map((category, index) => (
                                                                    <button
                                                                        key={index}
                                                                        className={cs(
                                                                            'category-item',
                                                                        )}
                                                                        onClick={() =>
                                                                            handleCategoryChange(
                                                                                category.trim(),
                                                                            )
                                                                        }
                                                                    >
                                                                        {category.trim()}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    )}

                                                <div className={cs('Date')}>
                                                    <p>
                                                        Ngày đăng:{' '}
                                                        {blog.createOn
                                                            ? new Date(
                                                                  blog.createOn + 'Z',
                                                              ).toLocaleDateString('vi-VN')
                                                            : 'Không có dữ liệu'}
                                                    </p>
                                                    <p>
                                                        Ngày công bố:{' '}
                                                        {blog.datePublic
                                                            ? new Date(
                                                                  blog.datePublic + 'Z',
                                                              ).toLocaleDateString('vi-VN')
                                                            : 'Không có dữ liệu'}
                                                    </p>
                                                </div>

                                                <div className={cs('actions')}>
                                                    <div className={cs('userPart')}>
                                                        {userRole !== 'guest' &&
                                                            userObject &&
                                                            userObject.id === blog.userId && (
                                                                <>
                                                                    <Link
                                                                        to={'/BlogUpdate'}
                                                                        state={{ blog }}
                                                                        className={cs('edit')}
                                                                    >
                                                                        Chỉnh sửa
                                                                    </Link>
                                                                    <button
                                                                        className={cs('delete')}
                                                                        onClick={() =>
                                                                            handleDelete(blog.id)
                                                                        }
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </>
                                                            )}
                                                    </div>
                                                    <p
                                                        className={cs('status', {
                                                            approved: blog.status === 'Thông qua',
                                                            rejected: blog.status === 'Từ chối',
                                                            report: blog.status === 'Báo cáo',
                                                            pending:
                                                                blog.status !== 'Thông qua' &&
                                                                blog.status !== 'Từ chối' &&
                                                                blog.status !== 'Báo cáo',
                                                        })}
                                                    >
                                                        {blog.status}
                                                    </p>
                                                    <Link
                                                        to={'/DetailBlog'}
                                                        state={{ blog }}
                                                        className={cs('btn-read-more')}
                                                    >
                                                        Xem thêm
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={cs('no-blogs')}>
                                        <p>Bạn chưa có bài viết nào!</p>
                                    </div>
                                )}
                            </div>

                            <div className={cs('blog-sidebar')}>
                                <div className={cs('actions-buttons')}>
                                    <Link to={'/CreateBlog'} className={cs('create-btn')}>
                                        Tạo bài viết mới
                                    </Link>
                                </div>

                                <div className={cs('filter-section')}>
                                    <h3>Lọc bài viết</h3>

                                    <h3>Danh mục</h3>
                                    <div className={cs('category-list')}>
                                        {categories.map((category, index) => (
                                            <button
                                                key={index}
                                                className={cs('category-btn', {
                                                    active: query.category === category,
                                                })}
                                                onClick={() => handleCategoryChange(category)}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    <div className={cs('sort-controls')}>
                                        <select
                                            name="sortBy"
                                            className={cs('sort-select')}
                                            value={query.sortBy}
                                            onChange={handleChange}
                                        >
                                            <option value="createOn">Sắp xếp theo ngày tạo</option>
                                            <option value="title">Sắp xếp theo tiêu đề</option>
                                            <option value="status">Sắp xếp theo trạng thái</option>
                                        </select>
                                        <button
                                            className={cs('sort-direction')}
                                            onClick={toggleSortDirection}
                                        >
                                            {query.IsDescending ? '↓' : '↑'}
                                        </button>
                                    </div>

                                    <div className={cs('filter-groups')}>
                                        <div className={cs('filter-group')}>
                                            <h3>Thời gian đăng</h3>
                                            <div className={cs('date-inputs')}>
                                                <select
                                                    className={cs('date-select')}
                                                    name="day"
                                                    value={dateFilter.day}
                                                    onChange={handleDateChange}
                                                >
                                                    <option value="">Ngày</option>
                                                    {Array.from(
                                                        { length: 31 },
                                                        (_, i) => i + 1,
                                                    ).map((day) => (
                                                        <option key={day} value={day}>
                                                            {day}
                                                        </option>
                                                    ))}
                                                </select>
                                                <select
                                                    className={cs('date-select')}
                                                    name="month"
                                                    value={dateFilter.month}
                                                    onChange={handleDateChange}
                                                >
                                                    <option value="">Tháng</option>
                                                    {Array.from(
                                                        { length: 12 },
                                                        (_, i) => i + 1,
                                                    ).map((month) => (
                                                        <option key={month} value={month}>
                                                            {month}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    className={cs('year-input')}
                                                    placeholder="Năm"
                                                    name="year"
                                                    value={dateFilter.year}
                                                    onChange={handleDateChange}
                                                    min="2000"
                                                    max="2099"
                                                />
                                            </div>
                                        </div>

                                        <div className={cs('filter-group')}>
                                            <h3>Trạng thái</h3>
                                            <select
                                                className={cs('status-select')}
                                                name="status"
                                                value={query.status}
                                                onChange={handleChange}
                                            >
                                                <option value="">Tất cả</option>
                                                {StatusOptions.map((status, index) => (
                                                    <option key={index} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <button className={cs('reset-button')} onClick={handleReset}>
                                        Đặt lại bộ lọc
                                    </button>
                                </div>
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className={cs('pagination')}>
                                <button
                                    className={cs('pagination-btn')}
                                    onClick={() => handlePageChange(1)}
                                    disabled={query.page === 1}
                                >
                                    ≪
                                </button>
                                <button
                                    className={cs('pagination-btn')}
                                    onClick={() => handlePageChange(query.page - 1)}
                                    disabled={query.page === 1}
                                >
                                    ◂
                                </button>
                                <div className={cs('page-numbers')}>{renderPageNumbers()}</div>
                                <button
                                    className={cs('pagination-btn')}
                                    onClick={() => handlePageChange(query.page + 1)}
                                    disabled={query.page === totalPages}
                                >
                                    ▸
                                </button>
                                <button
                                    className={cs('pagination-btn')}
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={query.page === totalPages}
                                >
                                    ≫
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileBlog;
