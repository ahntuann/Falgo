import { AdminLayout } from '~/layouts';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './BlogManagement.module.scss';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

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
    const StatusOptions = ['Thông qua', 'Từ chối', 'Báo cáo', 'Chờ duyệt', 'Duyệt lại'];
    const COLORS = ['#4caf50', '#f44336', '#9c27b0', '#ff9800', '#2196f3'];

    const startIndex = (query.page - 1) * query.postsPerPage;
    const endIndex = startIndex + query.postsPerPage;
    const totalPages = Math.ceil(filteredBlogs.length / query.postsPerPage);
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
    const role = JSON.parse(sessionStorage.getItem('admin'));
    const [hoveredBlog, setHoveredBlog] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const formatDateUTC = (date) => {
        const d = new Date(date);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    };

    const filteredBlogForChar = filteredBlogs.filter(
        (blog) => formatDateUTC(new Date(blog.createOn)) === formatDateUTC(selectedDate),
    );

    const countByday = (status) =>
        filteredBlogForChar.filter((blog) => blog.status === status).length;

    const countByStatus = (status) => originalBlogs.filter((blog) => blog.status === status).length;

    const chartDataToday = StatusOptions.map((status, index) => ({
        name: status,
        value: countByday(status),
        fill: COLORS[index],
    }));

    const chartDataAllTime = StatusOptions.map((status, index) => ({
        name: status,
        value: countByStatus(status),
        fill: COLORS[index],
    }));

    const handleMouseEnter = (blogId) => {
        setHoveredBlog(blogId);
    };

    const handleMouseLeave = () => {
        setHoveredBlog(null);
    };
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
        if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
            try {
                const response = await fetch(`http://localhost:5180/api/BlogController/${blogId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    alert('Xóa bình luận thất bại!');
                }

                alert('Xóa bài viết thành công!');
                setFilteredBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
            } catch (error) {
                alert('Lỗi khi xóa bình luận:', error);
            }
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
                fetchBlogs();
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
                <div className={cs('char_Space')}>
                    <h3>Thống kê bài viết</h3>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(new Date(date))}
                        dateFormat="dd/MM/yyyy"
                    />
                    <button
                        onClick={() => setSelectedDate(new Date())}
                        className={cs('reset-button')}
                    >
                        Cài lại
                    </button>
                    <div className={cs('Blog_number_char')}>
                        <div className={cs('BlogChar_detail')}>
                            <p>📊 Tổng số bài viết hôm nay: {filteredBlogForChar.length}</p>
                            <p>✔️ Thông qua: {countByday('Thông qua')}</p>
                            <p>🚨 Báo cáo: {countByday('Báo cáo')}</p>
                            <p>⏳ Chờ duyệt: {countByday('Chờ duyệt')}</p>
                            <p>🔄 Duyệt lại: {countByday('Duyệt lại')}</p>
                            <p>❌ Từ chối: {countByday('Từ chối')}</p>
                        </div>
                        <div className={cs('Blog_char')}>
                            <BarChart width={500} height={300} data={chartDataToday}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend
                                    payload={chartDataToday.map((item) => ({
                                        value: item.name,
                                        type: 'square',
                                        color: item.fill,
                                    }))}
                                />
                                <Bar dataKey="value">
                                    {chartDataToday.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </div>
                    </div>

                    <div className={cs('Blog_number_char')}>
                        <div className={cs('BlogChar_detail')}>
                            <p>📊 Tổng số bài viết đã tạo: {originalBlogs.length}</p>
                            <p>✔️ Thông qua: {countByStatus('Thông qua')}</p>
                            <p>🚨 Báo cáo: {countByStatus('Báo cáo')}</p>
                            <p>⏳ Chờ duyệt: {countByStatus('Chờ duyệt')}</p>
                            <p>🔄 Duyệt lại: {countByStatus('Duyệt lại')}</p>
                            <p>❌ Từ chối: {countByStatus('Từ chối')}</p>
                        </div>
                        <div className={cs('Blog_char')}>
                            <BarChart width={500} height={300} data={chartDataAllTime}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend
                                    payload={chartDataToday.map((item) => ({
                                        value: item.name,
                                        type: 'square',
                                        color: item.fill,
                                    }))}
                                />
                                <Bar dataKey="value">
                                    {chartDataToday.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </div>
                    </div>
                </div>

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
                                <h2
                                    onMouseEnter={() => handleMouseEnter(blog.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {blog.title}
                                    {hoveredBlog === blog.id && (
                                        <div className={cs('popup')}>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: blog.content }}
                                            />
                                        </div>
                                    )}
                                </h2>

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
                                    <div className={cs('Action_space')}>
                                        <div class={cs('Like_Share_cmt')}>
                                            <div className={cs('Like')}>
                                                <div className={cs('Number_Like')}>
                                                    {blog?.blogLike?.length || 0} 💙 Đã thích
                                                </div>
                                            </div>
                                            <div className={cs('Share')}>
                                                <div className={cs('Number_Share')}>
                                                    {blog?.blogShare?.length || 0} 🔗 Chia sẻ
                                                </div>
                                            </div>
                                            <div className={cs('Cmt')}>
                                                <div className={cs('Number_Cmt')}>
                                                    {blog?.commentBlog?.length || 0} Bình luận
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            to={'/BlogUpdate'}
                                            state={{ blog }}
                                            className={cs('edit')}
                                        >
                                            Chỉnh sửa
                                        </Link>
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
                                    </div>
                                    {blog.status === 'Báo cáo' && (
                                        <div className={cs('Note')}>{blog.note}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={cs('no-blogs')}>Không có bài viết nào.</p>
                )}
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
            </div>
        </AdminLayout>
    );
}
export default BlogManagement;
