import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import classNames from 'classnames/bind';
import styles from './UserBlog.module.scss';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';

import { useContext } from 'react';
import AuthContext from '~/context/AuthContext';
import { Link } from 'react-router-dom';

const cs = classNames.bind(styles);

const UserBlog = () => {
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
        'Câu Hỏi',
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
        console.log('ID nhận được trong handleDelete:', blogId);

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

    return (
        <div className={cs('container')}>
            {/* DataBase */}

            <div className={cs('blog')}>
                <div>
                    <div className={cs('blog_title_search')}>
                        <h2 className={cs('title')}>Danh sách bài viết đã tạo</h2>
                        <div className={cs('search-bar')}>
                            <input
                                type="text"
                                name="search"
                                placeholder="Tìm kiếm bài viết..."
                                value={query.search}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Bloglist */}
                        <div className={cs('blog-list')}>
                            {paginatedBlogs.length > 0 ? (
                                paginatedBlogs.map((blog) => (
                                    <div key={blog.id} className={cs('blog-item')}>
                                        <img
                                            src={blog.thumbnail ? blog.thumbnail : NoImage}
                                            alt={blog.title}
                                            className={cs('thumbnail')}
                                            onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
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
                                                                    className={cs('category-item')}
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

                                            <p>
                                                Ngày đăng:{' '}
                                                {blog.createOn
                                                    ? new Date(
                                                          blog.createOn + 'Z',
                                                      ).toLocaleDateString('vi-VN')
                                                    : 'Không có dữ liệu'}
                                            </p>

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
                                                    Đọc thêm
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={cs('no-blogs')}>Không có bài viết nào.</p>
                            )}
                        </div>
                        {/* End Bloglist */}

                        {/* pagination */}
                        <div className={cs('pagination')}>
                            <button
                                disabled={query.page === 1}
                                onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))}
                            >
                                Đầu
                            </button>

                            <button
                                disabled={query.page === 1}
                                onClick={() =>
                                    setQuery((prev) => ({ ...prev, page: prev.page - 1 }))
                                }
                            >
                                Trước
                            </button>

                            <div className={cs('paginationnumber')}>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                    (page) =>
                                        page === query.page ? (
                                            <span key={page} className={cs('current-page')}>
                                                {page}
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setQuery({ ...query, page })}
                                            >
                                                {page}
                                            </button>
                                        ),
                                )}
                            </div>

                            <button
                                disabled={query.page >= totalPages}
                                onClick={() =>
                                    setQuery((prev) => ({ ...prev, page: prev.page + 1 }))
                                }
                            >
                                Sau
                            </button>

                            <button
                                disabled={query.page === totalPages}
                                onClick={() => setQuery((prev) => ({ ...prev, page: totalPages }))}
                            >
                                Cuối
                            </button>
                        </div>
                        {/* End pagination */}
                    </div>
                </div>

                <div className={cs('Create_UBlog_sidebar')}>
                    <div className={cs('Create_UBlog')}>
                        <Link to={'/CreateBlog'} className={cs('Create')}>
                            Tạo Bài
                        </Link>
                        <Link to={'/UserBlog'} className={cs('UBlog')}>
                            Bài Viết
                        </Link>
                    </div>
                    {/* sidebar */}
                    <div className={cs('sidebar')}>
                        {/* category */}
                        <h3>Danh mục</h3>
                        <div className={cs('category-list')}>
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    className={cs({ active: query.category === category })}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        {/* End category */}

                        {/* sortBy */}
                        <h3>Sắp xếp theo</h3>
                        <div className={cs('sort-controls')}>
                            <select name="sortBy" value={query.sortBy} onChange={handleChange}>
                                <option value="createOn">Ngày đăng</option>
                                <option value="title">Tiêu đề</option>
                                <option value="status">Trạng thái</option>
                            </select>
                            <button
                                onClick={() =>
                                    setQuery((prev) => ({
                                        ...prev,
                                        IsDescending: !prev.IsDescending,
                                    }))
                                }
                            >
                                {query.IsDescending ? 'Giảm dần' : 'Tăng dần'}
                            </button>
                        </div>
                        {/* End sortBy */}

                        {/* date-filter */}
                        <div className={cs('filter-name')}>
                            <h3>Lọc theo ngày</h3>
                            <h3>Trạng thái</h3>
                        </div>
                        <div className={cs('date-filter')}>
                            <div className={cs('DateInput')}>
                                <select
                                    name="day"
                                    value={dateFilter.day}
                                    onChange={handleDateChange}
                                >
                                    <option value="">Ngày</option>
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="month"
                                    value={dateFilter.month}
                                    onChange={handleDateChange}
                                >
                                    <option value="">Tháng</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    name="year"
                                    placeholder="năm"
                                    value={dateFilter.year}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <select name="status" value={query.status} onChange={handleChange}>
                                <option value="">Tất cả</option>
                                {StatusOptions.map((status, index) => (
                                    <option key={index} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* End date-filter */}

                        {/* reset-button */}
                        <button className={cs('reset-button')} onClick={handleReset}>
                            Reset
                        </button>
                        {/* End reset-button */}
                    </div>
                    {/* End sidebar */}
                </div>
            </div>
            {/* End DataBase */}
        </div>
    );
};

export default UserBlog;
