import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';

import { useContext } from 'react';
import AuthContext from '~/context/AuthContext';
import { Link } from 'react-router-dom';

const cs = classNames.bind(styles);

const Blog = () => {
    const { userRole } = useContext(AuthContext);
    const userNow = localStorage.getItem('user');
    const userObject = userNow ? JSON.parse(userNow) : null;

    const [originalBlogs, setOriginalBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    const [blogMostLikeAndShare, setBlogMostLikeAndShare] = useState(null);
    const [blogMostLike, setBlogMostLike] = useState(null);
    const [blogMostShare, setBlogMostShare] = useState(null);

    useEffect(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const validBlogs = filteredBlogs
            .map((blog) => ({
                ...blog,
                likes: blog.blogLike?.length || 0,
                shares: blog.blogShare?.length || 0,
            }))
            .filter((blog) => {
                const blogDate = new Date(blog.datePublic);
                return (
                    blogDate >= firstDayOfMonth &&
                    blogDate <= lastDayOfMonth &&
                    (blog.likes > 0 || blog.shares > 0)
                );
            });

        if (validBlogs.length === 0) {
            setBlogMostLikeAndShare(null);
            setBlogMostLike(null);
            setBlogMostShare(null);
            return;
        }

        setBlogMostLikeAndShare(
            validBlogs.reduce(
                (max, blog) =>
                    blog.likes + blog.shares > (max?.likes + max?.shares || 0) ? blog : max,
                validBlogs[0],
            ),
        );

        setBlogMostLike(
            validBlogs.reduce(
                (max, blog) => (blog.likes > (max?.likes || 0) ? blog : max),
                validBlogs[0],
            ),
        );

        setBlogMostShare(
            validBlogs.reduce(
                (max, blog) => (blog.shares > (max?.shares || 0) ? blog : max),
                validBlogs[0],
            ),
        );
    }, [filteredBlogs]);

    const [categories] = useState([
        { name: 'Thử thách', icon: '🔥' },
        { name: 'Hướng dẫn', icon: '📖' },
        { name: 'Kinh nghiệm', icon: '🧑‍💻' },
        { name: 'Mẹo lập trình', icon: '💡' },
        { name: 'Xu hướng lập trình', icon: '🚀' },
    ]);
    const [query, setQuery] = useState({
        search: '',
        category: '',
        sortBy: 'createOn',
        IsDescending: true,
        page: 1,
        postsPerPage: 10,
        dateFilter: '',
    });

    const startIndex = (query.page - 1) * query.postsPerPage;
    const endIndex = startIndex + query.postsPerPage;
    const availableblog = filteredBlogs.filter(
        (blog) =>
            (blog.status === 'Thông qua' || blog.status === 'Báo cáo') &&
            new Date(blog.datePublic) < new Date(),
    );
    const totalPages = Math.ceil(availableblog.length / query.postsPerPage);
    const paginatedBlogs = availableblog.slice(startIndex, endIndex);
    const debounceRef = useRef(null);

    const [dateFilter, setDateFilter] = useState({
        day: '',
        month: '',
        year: '',
    });

    useEffect(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const validBlogs = availableblog
            .map((blog) => ({
                ...blog,
                likes: blog.blogLike?.length || 0,
                shares: blog.blogShare?.length || 0,
            }))
            .filter((blog) => {
                const blogDate = new Date(blog.datePublic);
                return (
                    blogDate >= firstDayOfMonth &&
                    blogDate <= lastDayOfMonth &&
                    (blog.likes > 0 || blog.shares > 0)
                );
            });

        if (validBlogs.length === 0) {
            setBlogMostLikeAndShare(null);
            setBlogMostLike(null);
            setBlogMostShare(null);
            return;
        }

        const blogMostLikeAndShare = validBlogs.reduce(
            (max, blog) =>
                blog.likes + blog.shares > (max?.likes + max?.shares || 0) ? blog : max,
            validBlogs[0],
        );

        const remainingBlogs = validBlogs.filter((blog) => blog.id !== blogMostLikeAndShare.id);

        const blogMostLike = remainingBlogs.length
            ? remainingBlogs.reduce(
                  (max, blog) => (blog.likes > (max?.likes || 0) ? blog : max),
                  remainingBlogs[0],
              )
            : null;

        const remainingAfterLike = remainingBlogs.filter((blog) => blog.id !== blogMostLike?.id);

        const blogMostShare = remainingAfterLike.length
            ? remainingAfterLike.reduce(
                  (max, blog) => (blog.shares > (max?.shares || 0) ? blog : max),
                  remainingAfterLike[0],
              )
            : null;

        setBlogMostLikeAndShare(blogMostLikeAndShare);
        setBlogMostLike(blogMostLike);
        setBlogMostShare(blogMostShare);
    }, [filteredBlogs]);

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

            fetchedBlogs = fetchedBlogs.sort((a, b) => {
                if (query.sortBy === 'createOn') {
                    return query.IsDescending
                        ? new Date(b.createOn) - new Date(a.createOn)
                        : new Date(a.createOn) - new Date(b.createOn);
                } else if (query.sortBy === 'title') {
                    return query.IsDescending
                        ? b.title.localeCompare(a.title)
                        : a.title.localeCompare(b.title);
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
            IsDescending: true,
            page: 1,
            postsPerPage: 10,
            dateFilter: '',
        });

        setDateFilter({ date: '', day: '', month: '', year: '' });
        setFilteredBlogs(originalBlogs);
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        if (!selectedDate) {
            setDateFilter({ day: '', month: '', year: '' });
            return;
        }

        const [year, month, day] = selectedDate.split('-');

        setDateFilter({
            day: day || '',
            month: month || '',
            year: year || '',
        });
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

    // const handleDelete = async (blogId) => {
    //     if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;

    //     try {
    //         const url = `http://localhost:5180/api/BlogController/${blogId}`;
    //         console.log('Request URL:', url);
    //         const token = localStorage.getItem('accessToken');
    //         console.log('id', blogId);
    //         const response = await fetch(`http://localhost:5180/api/BlogController/${blogId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Accept: '*/*',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             credentials: 'include',
    //         });

    //         if (response.status === 401) {
    //             alert('Bạn cần đăng nhập để xóa bài viết!');
    //             return;
    //         }

    //         const text = await response.text();

    //         if (response.ok) {
    //             alert('Xóa bài viết thành công!');
    //             setFilteredBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
    //         } else {
    //             alert(`Xóa thất bại! Server trả về: ${text}`);
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi xóa bài viết:', error);
    //         alert('Có lỗi xảy ra!');
    //     }
    // };

    const handleDelete = async (blogId) => { 
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;
    
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('Bạn cần đăng nhập để xóa bài viết!');
                return;
            }
    
            const url = `http://localhost:5180/api/BlogController/${blogId}`;
            console.log("Request URL:", url);
    
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Gửi token để xác thực
                    'Accept': '*/*',
                },
                credentials: 'include',
            });
    
            console.log("Response status:", response.status);
    
            if (response.status === 401) {
                alert('Bạn cần đăng nhập để xóa bài viết!');
                return;
            }
    
            if (response.status === 403) {
                alert('Bạn không có quyền xóa bài viết này!');
                return;
            }
    
            if (response.status === 404) {
                alert('Không tìm thấy bài viết để xóa!');
                return;
            }
    
            const text = await response.text();
            console.log("Response text:", text);
    
            if (response.ok) {
                alert(`Xóa bài viết thành công!`);
                setFilteredBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
            } else {
                alert(`Xóa thất bại! Server trả về: ${text}`);
            }
        } catch (error) {
            console.error('Lỗi khi xóa bài viết:', error);
            alert('Có lỗi xảy ra khi gửi yêu cầu xóa!');
        }
    };
    

    return (
        <div className={cs('container')}>
            <div className={cs('blog')}>
                <div>
                    <div className={cs('blog_title_search')}>
                        <div className={cs('search-bar')}>
                            <input
                                type="text"
                                name="search"
                                placeholder="Tìm kiếm bài viết..."
                                value={query.search}
                                onChange={handleChange}
                            />
                        </div>
                        {(blogMostLikeAndShare || blogMostLike || blogMostShare) && (
                            <div className={cs('suggest_space')}>
                                <h2 className={cs('title')}>Bài viết nổi bật</h2>
                                {blogMostLikeAndShare && (
                                    <div key={blogMostLikeAndShare.id} className={cs('blog-item')}>
                                        <img
                                            src={
                                                blogMostLikeAndShare.thumbnail
                                                    ? blogMostLikeAndShare.thumbnail
                                                    : NoImage
                                            }
                                            alt={blogMostLikeAndShare.title}
                                            className={cs('thumbnail')}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = NoImage;
                                            }}
                                        />

                                        <div className={cs('content')}>
                                            <h2>{blogMostLikeAndShare.title}</h2>
                                            <p>{blogMostLikeAndShare.description}</p>
                                            {blogMostLikeAndShare.categoryBlog &&
                                                blogMostLikeAndShare.categoryBlog.trim() !== '' &&
                                                blogMostLikeAndShare.categoryBlog.trim() !==
                                                    ',' && (
                                                    <div className={cs('category-tags')}>
                                                        {blogMostLikeAndShare.categoryBlog
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
                                                {blogMostLikeAndShare.createOn
                                                    ? new Date(
                                                          blogMostLikeAndShare.createOn + 'Z',
                                                      ).toLocaleDateString('vi-VN')
                                                    : 'Không có dữ liệu'}
                                            </p>

                                            <div className={cs('actions')}>
                                                <div className={cs('userPart')}>
                                                    {userRole !== 'guest' &&
                                                        userObject &&
                                                        userObject.id ===
                                                            blogMostLikeAndShare.userId && (
                                                            <div>
                                                                <Link
                                                                    to={'/BlogUpdate'}
                                                                    state={{
                                                                        blog: blogMostLikeAndShare,
                                                                    }}
                                                                    className={cs('edit')}
                                                                >
                                                                    Chỉnh sửa
                                                                </Link>
                                                                <button
                                                                    className={cs('delete')}
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            blogMostLikeAndShare.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        )}
                                                </div>
                                                <Link
                                                    to={'/DetailBlog'}
                                                    state={{
                                                        blog: blogMostLikeAndShare,
                                                    }}
                                                    className={cs('btn-read-more')}
                                                >
                                                    Đọc thêm
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {blogMostLike && (
                                    <div key={blogMostLike.id} className={cs('blog-item')}>
                                        <img
                                            src={
                                                blogMostLike.thumbnail
                                                    ? blogMostLike.thumbnail
                                                    : NoImage
                                            }
                                            alt={blogMostLike.title}
                                            className={cs('thumbnail')}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = NoImage;
                                            }}
                                        />

                                        <div className={cs('content')}>
                                            <h2>{blogMostLike.title}</h2>
                                            <p>{blogMostLike.description}</p>
                                            {blogMostLike.categoryBlog &&
                                                blogMostLike.categoryBlog.trim() !== '' &&
                                                blogMostLike.categoryBlog.trim() !== ',' && (
                                                    <div className={cs('category-tags')}>
                                                        {blogMostLike.categoryBlog
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
                                                {blogMostLike.createOn
                                                    ? new Date(
                                                          blogMostLike.createOn + 'Z',
                                                      ).toLocaleDateString('vi-VN')
                                                    : 'Không có dữ liệu'}
                                            </p>

                                            <div className={cs('actions')}>
                                                <div className={cs('userPart')}>
                                                    {userRole !== 'guest' &&
                                                        userObject &&
                                                        userObject.id === blogMostLike.userId && (
                                                            <div>
                                                                <Link
                                                                    to={'/BlogUpdate'}
                                                                    state={{
                                                                        blog: blogMostLike,
                                                                    }}
                                                                    className={cs('edit')}
                                                                >
                                                                    Chỉnh sửa
                                                                </Link>
                                                                <button
                                                                    className={cs('delete')}
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            blogMostLike.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        )}
                                                </div>
                                                <Link
                                                    to={'/DetailBlog'}
                                                    state={{
                                                        blog: blogMostLike,
                                                    }}
                                                    className={cs('btn-read-more')}
                                                >
                                                    Đọc thêm
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {blogMostShare && (
                                    <div key={blogMostShare.id} className={cs('blog-item')}>
                                        <img
                                            src={
                                                blogMostShare.thumbnail
                                                    ? blogMostShare.thumbnail
                                                    : NoImage
                                            }
                                            alt={blogMostShare.title}
                                            className={cs('thumbnail')}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = NoImage;
                                            }}
                                        />

                                        <div className={cs('content')}>
                                            <h2>{blogMostShare.title}</h2>
                                            <p>{blogMostShare.description}</p>
                                            {blogMostShare.categoryBlog &&
                                                blogMostShare.categoryBlog.trim() !== '' &&
                                                blogMostShare.categoryBlog.trim() !== ',' && (
                                                    <div className={cs('category-tags')}>
                                                        {blogMostShare.categoryBlog
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
                                                {blogMostShare.createOn
                                                    ? new Date(
                                                          blogMostShare.createOn + 'Z',
                                                      ).toLocaleDateString('vi-VN')
                                                    : 'Không có dữ liệu'}
                                            </p>

                                            <div className={cs('actions')}>
                                                <div className={cs('userPart')}>
                                                    {userRole !== 'guest' &&
                                                        userObject &&
                                                        userObject.id === blogMostShare.userId && (
                                                            <div>
                                                                <Link
                                                                    to={'/BlogUpdate'}
                                                                    state={{
                                                                        blog: blogMostShare,
                                                                    }}
                                                                    className={cs('edit')}
                                                                >
                                                                    Chỉnh sửa
                                                                </Link>
                                                                <button
                                                                    className={cs('delete')}
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            blogMostShare.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </div>
                                                        )}
                                                </div>
                                                <Link
                                                    to={'/DetailBlog'}
                                                    state={{
                                                        blog: blogMostShare,
                                                    }}
                                                    className={cs('btn-read-more')}
                                                >
                                                    Đọc thêm
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <h2 className={cs('title')}>Danh sách bài viết</h2>

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
                                                            <div>
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
                                                            </div>
                                                        )}
                                                </div>
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
                    </div>
                </div>
                <div className={cs('Create_UBlog_sidebar')}>
                    <div className={cs('Create_UBlog')}>
                        <Link to={'/CreateBlog'} className={cs('Create')}>
                            Tạo bài
                        </Link>
                        <Link to={'/BlogBookMark'} className={cs('UBlog')}>
                            Đã Lưu
                        </Link>
                        <Link to={'/UserBlog'} className={cs('UBlog')}>
                            Đã tạo
                        </Link>
                    </div>
                    <div className={cs('sidebar')}>
                        <h3>Danh mục</h3>
                        <div className={cs('category-list')}>
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    className={cs({ active: query.category === category.name })}
                                    onClick={() => handleCategoryChange(category.name)}
                                >
                                    {category.name}
                                    {category.icon}
                                </button>
                            ))}
                        </div>

                        <h3>Sắp xếp theo</h3>
                        <div className={cs('sort-controls')}>
                            <select name="sortBy" value={query.sortBy} onChange={handleChange}>
                                <option value="createOn">Ngày đăng</option>
                                <option value="title">Tiêu đề</option>
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

                        <h3>Lọc theo ngày</h3>

                        <div className={cs('date-filter')}>
                            <input
                                type="date"
                                value={dateFilter.date}
                                onChange={handleDateChange}
                                className={cs('DateInput')}
                            />
                        </div>

                        <button className={cs('reset-button')} onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
