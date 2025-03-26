import { AdminLayout } from '~/layouts';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './BlogManagement.module.scss';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const cs = classNames.bind(styles);

function BlogManagement() {
    const navigate = useNavigate();
    const [originalBlogs, setOriginalBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const debounceRef = useRef(null);
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
    const [categories] = useState([
        'Mẹo lập trình',
        'Hướng dẫn',
        'Xu hướng lập trình',
        'Kinh Nghiệm',
        'Thử thách',
        'Câu Hỏi',
    ]);
    const StatusOptions = ['Chờ duyệt', 'Duyệt Lại', 'Thông qua', 'Từ chối', 'Báo cáo'];
    const startIndex = (query.page - 1) * query.postsPerPage;
    const endIndex = startIndex + query.postsPerPage;
    const totalPages = Math.ceil(filteredBlogs.length / query.postsPerPage);
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
    const role = JSON.parse(sessionStorage.getItem('admin'));

    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role]);

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

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchBlogs();
        }, 1000);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const handleCategoryChange = (category) => {
        setQuery((prev) => ({
            ...prev,
            category: prev.category === category ? '' : category,
        }));
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuery((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const updateBlogStatus = async (blogId, newStatus) => {
        if (
            !window.confirm(
                `Bạn có chắc chắn muốn đổi trạng thái bài viết thành "${newStatus}" không?`,
            )
        ) {
            return;
        }

        let reason = '';

        if (newStatus === 'Từ chối') {
            reason = prompt('Hãy nhập lý do từ chối:', 'Vi phạm cộng đồng!!!');
            if (reason === null) return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const blogToUpdate = originalBlogs.find((blog) => blog.id === blogId);
            if (!blogToUpdate) {
                alert('Không tìm thấy bài viết để cập nhật!');
                return;
            }
            const updatedBlog = { ...blogToUpdate, status: newStatus, note: reason };
            console.log('updatedBlog ', updatedBlog);
            const response = await fetch(`http://localhost:5180/api/BlogController/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedBlog),
            });

            if (response.ok) {
                alert(`Bài viết đã được cập nhật trạng thái: ${newStatus}`);
                setFilteredBlogs((prevBlogs) =>
                    prevBlogs.map((blog) =>
                        blog.id === blogId ? { ...blog, status: newStatus, note: reason } : blog,
                    ),
                );
            } else {
                const text = await response.text();
                alert(`Cập nhật thất bại! Lỗi từ server: ${text}`);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    return (
        <AdminLayout>
            <div className={cs('container')}>
                <div className={cs('topbar')}>
                    <div className={cs('search-bar')}>
                        <input
                            type="text"
                            name="search"
                            placeholder="Tìm kiếm bài viết..."
                            value={query.search}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cs('category')}>
                        <select name="category" value={query.category} onChange={handleChange}>
                            <option value="">Phân Loại</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
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
                    <div className={cs('status')}>
                        <select name="status" value={query.status} onChange={handleChange}>
                            <option value="">Trạng Thái</option>
                            {StatusOptions.map((status, index) => (
                                <option key={index} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className={cs('Reset')}
                        onClick={() =>
                            setQuery({
                                search: '',
                                category: '',
                                status: '',
                                sortBy: 'createOn',
                                IsDescending: true,
                                page: 1,
                                postsPerPage: 10,
                                dateFilter: '',
                            })
                        }
                    >
                        Reset
                    </button>
                </div>
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
                        onClick={() => setQuery((prev) => ({ ...prev, page: prev.page - 1 }))}
                    >
                        Trước
                    </button>

                    <div className={cs('paginationnumber')}>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) =>
                            page === query.page ? (
                                <span key={page} className={cs('current-page')}>
                                    {page}
                                </span>
                            ) : (
                                <button key={page} onClick={() => setQuery({ ...query, page })}>
                                    {page}
                                </button>
                            ),
                        )}
                    </div>

                    <button
                        disabled={query.page >= totalPages}
                        onClick={() => setQuery((prev) => ({ ...prev, page: prev.page + 1 }))}
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
                                            {blog.categoryBlog.split(',').map((category, index) => (
                                                <button
                                                    key={index}
                                                    className={cs('category-item')}
                                                    onClick={() =>
                                                        handleCategoryChange(category.trim())
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
                                        ? new Date(blog.createOn + 'Z').toLocaleDateString('vi-VN')
                                        : 'Không có dữ liệu'}
                                </p>

                                <div className={cs('actions')}>
                                    <Link
                                        to={'/BlogUpdate'}
                                        state={{ blog }}
                                        className={cs('edit')}
                                    >
                                        Chỉnh sửa
                                    </Link>
                                    <button
                                        className={cs('delete')}
                                        onClick={() => handleDelete(blog.id)}
                                    >
                                        Xóa
                                    </button>
                                    <Link
                                        to={'/DetailBlog'}
                                        state={{ blog }}
                                        className={cs('btn-read-more')}
                                    >
                                        Đọc thêm
                                    </Link>
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
                                    <button
                                        className={cs('UpdateStatus')}
                                        onClick={() => updateBlogStatus(blog.id, 'Thông qua')}
                                    >
                                        Công khai
                                    </button>
                                    <button
                                        className={cs('UpdateStatus')}
                                        onClick={() => updateBlogStatus(blog.id, 'Từ chối')}
                                    >
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                            {blog.status === 'Báo cáo' && (
                                <div className={cs('Note')}>{blog.note}</div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={cs('no-blogs')}>Không có bài viết nào.</p>
                )}
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
                        onClick={() => setQuery((prev) => ({ ...prev, page: prev.page - 1 }))}
                    >
                        Trước
                    </button>

                    <div className={cs('paginationnumber')}>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) =>
                            page === query.page ? (
                                <span key={page} className={cs('current-page')}>
                                    {page}
                                </span>
                            ) : (
                                <button key={page} onClick={() => setQuery({ ...query, page })}>
                                    {page}
                                </button>
                            ),
                        )}
                    </div>

                    <button
                        disabled={query.page >= totalPages}
                        onClick={() => setQuery((prev) => ({ ...prev, page: prev.page + 1 }))}
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
        </AdminLayout>
    );
}
export default BlogManagement;
