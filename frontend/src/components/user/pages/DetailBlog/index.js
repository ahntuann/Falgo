import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AuthContext from '~/context/AuthContext';

import classNames from 'classnames/bind';
import styles from './DetailBlog.module.scss';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import { Link } from 'react-router-dom';

const cs = classNames.bind(styles);

const DetailBlog = () => {
    const { userRole } = useContext(AuthContext);
    const userNow = localStorage.getItem('user');

    const userObject = userNow ? JSON.parse(userNow) : null;
    const location = useLocation();
    const [blog, setBlog] = useState(location.state?.blog);

    const [allBlogs, setAllBlogs] = useState([]);

    const [liked, setLiked] = useState();
    const [comments, setComments] = useState([]);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:5180/api/BlogController')
            .then((response) => {
                setAllBlogs(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi tải danh sách blog:', error);
            });
    }, [blog]);

    useEffect(() => {
        if (userRole !== 'guest') {
            if (blog) {
                setLiked(blog.blogLike.some((like) => like.userID === userObject.id));
                console.log(blog);
            }
        }
    }, [blog, userObject]);

    const suggestByAuthor = useMemo(() => {
        return allBlogs.filter((b) => b.userId === blog?.userId && b.id !== blog?.id).slice(0, 3);
    }, [allBlogs, blog]);

    const suggestBlogs = useMemo(() => {
        return allBlogs
            .filter((b) => b.id !== blog?.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    }, [allBlogs, blog]);

    if (!blog) return <div className={cs('error-message')}>Không tìm thấy bài viết!</div>;

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
            window.location.href = '/blog';
            if (response.ok) {
                alert('Xóa bài viết thành công!');
                setAllBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
            } else {
                alert(`Xóa thất bại! Server trả về: ${text}`);
            }
        } catch (error) {
            console.error('Lỗi mạng hoặc server:', error);
            alert('Lỗi hệ thống! Vui lòng thử lại sau.');
        }
    };

    const handleLike = async () => {
        if (!userObject?.id) {
            alert('Bạn cần đăng nhập để like bài viết!');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(
                `http://localhost:5180/api/BlogLikeController/ToggleLike`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        blogID: blog.id,
                        userID: userObject.id,
                    }),
                },
            );

            if (response.ok) {
                const result = await response.json();
                console.log('Response từ server:', result);
                setLiked(result.liked);

                const updatedBlog = { ...blog };
                if (result.liked) {
                    updatedBlog.blogLike.push({ userID: userObject.id });
                } else {
                    updatedBlog.blogLike = updatedBlog.blogLike.filter(
                        (like) => like.userID !== userObject.id,
                    );
                }
                setBlog(updatedBlog);

                alert(result.message);
            } else {
                const result = await response.text();
                console.error('Lỗi server:', result);
                alert(`Thao tác không thành công! Lỗi: ${result}`);
            }
        } catch (error) {
            console.error('Lỗi khi like bài viết:', error);
            alert('Lỗi kết nối đến server!');
        }
    };

    const handleComment = async () => {
        // if (!userObject?.id) {
        //     alert('Bạn cần đăng nhập để bình luận!');
        //     return;
        // }

        if (!comments.trim()) {
            alert('Vui lòng nhập nội dung bình luận!');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch('http://localhost:5180/api/BlogCommentController', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    avatar: userObject?.avatar ?? NoImage,
                    guestName: userObject?.userName ?? 'Guest',
                    content: comments,
                    blogId: blog.id,
                    userId: userObject?.id ?? null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Bình luận thành công:', result);
                alert('Cảm ơn đã bình luận!!');
                setBlog((prevBlog) => ({
                    ...prevBlog,
                    commentBlog: [...prevBlog.commentBlog, result.comment],
                }));

                setComments('');
            } else {
                const errorText = await response.text();
                console.error('Lỗi khi gửi bình luận:', errorText);
                alert('Gửi bình luận thất bại!');
            }
        } catch (error) {
            console.error('Lỗi kết nối:', error);
            alert('Lỗi kết nối đến server!');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        // const blogUrl = `http://localhost:3000/DetailBlog/${blog.id}`;
        // navigator.clipboard.writeText(blogUrl);
        alert('Đã sao chép link!');
        setShowPopup(false);
    };

    const handleShare = async (platform) => {
        const confirmShare = window.confirm(`Bạn có muốn chia sẻ lên ${platform} không?`);
        if (!confirmShare) return;
        try {
            const token = localStorage.getItem('accessToken');

            const currentURL = window.location.href;

            console.log('currentURL: ', currentURL);
            let shareURL = '';
            if (platform === 'Facebook') {
                shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    currentURL,
                )}`;
            } else if (platform === 'Twitter') {
                shareURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentURL)}`;
            }

            if (shareURL) {
                window.open(shareURL, '_blank');
            }

            const response = await fetch('http://localhost:5180/api/BlogShareController', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    blogID: blog.id,
                    userID: userObject?.id ?? null,
                    sharedPlatform: platform,
                }),
            });

            if (response.ok) {
                alert(`Đã chia sẻ lên ${platform}`);
                console.log(response);
                const result = await response.json();
                console.log('Share:', result);

                setBlog((prevBlog) => ({
                    ...prevBlog,
                    blogShare: [...(prevBlog.blogShare || []), result],
                }));
            } else {
                console.error('Lỗi chia sẻ:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi kết nối:', error);
        }
        setShowPopup(false);
    };

    return (
        <div className={cs('show-container')}>
            <div className={cs('show-Conent')}>
                <div className={cs('show-content-informationinformation')}>
                    <div>
                        <h2>{blog.title}</h2>
                        <p>
                            <strong>Tác giả:</strong> {blog.guestName}
                        </p>
                        <p>{blog.description}</p>
                        <p>
                            <strong>Danh mục:</strong> {blog.categoryBlog}
                        </p>
                        <p>
                            <strong>Ngày đăng:</strong>{' '}
                            {new Date(blog.createOn).toLocaleDateString('vi-VN')}
                        </p>
                        {userRole !== 'guest' && userObject?.id === blog.userId && (
                            <div className={cs('action-buttons')}>
                                <Link to={'/BlogUpdate'} state={{ blog }} className={cs('edit')}>
                                    Chỉnh sửa
                                </Link>
                                <button
                                    className={cs('delete-btn')}
                                    onClick={() => handleDelete(blog.id)}
                                >
                                    {' '}
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                    <img
                        src={blog.thumbnail ? blog.thumbnail : NoImage}
                        alt={blog.title}
                        className={cs('thumbnail')}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = NoImage;
                        }}
                    />
                </div>
                <div className={cs('show-content')}>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    {blog.imageBlog !== null &&
                        blog.imageBlog !== '' &&
                        (/^data:image/.test(blog.imageBlog) ||
                        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(blog.imageBlog) ? (
                            <img
                                src={blog.imageBlog}
                                alt={`Ảnh ${blog.title}`}
                                className={cs('ContextImgVideo')}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = NoImage;
                                }}
                            />
                        ) : /\.(mp4|webm|ogg)$/i.test(blog.imageBlog) ? (
                            <video controls className={cs('ContextImgVideo')}>
                                <source src={blog.imageBlog} type={blog.title} />
                            </video>
                        ) : blog.imageBlog.includes('youtube.com') ||
                          blog.imageBlog.includes('youtu.be') ? (
                            <iframe
                                src={blog.imageBlog}
                                title={blog.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className={cs('ContextImgVideo')}
                            ></iframe>
                        ) : null)}
                </div>

                <div className={cs('ActionBarBar')}>
                    <div className={cs('Like_space')}>
                        <div className={cs('Number_Like')}>{blog?.blogLike?.length || 0}</div>
                        <button className={cs('Like_Action', { liked })} onClick={handleLike}>
                            {liked ? '💙 Đã thích' : '🤍 Thích'}
                        </button>
                    </div>
                    <div className={cs('cmt_Space')}>
                        <input
                            type="text"
                            placeholder="Nhập bình luận..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                        <button className={cs('cmt_Action')} onClick={handleComment}>
                            Lưu
                        </button>
                    </div>
                    <div className={cs('Share_space')}>
                        <div className={cs('Number_Share')}>{blog?.blogShare?.length || 0}</div>
                        {/* <div className={cs('Share_Action')}> */}

                        <button className={cs('Share_Action')} onClick={() => setShowPopup(true)}>
                            🔗 Chia sẻ
                        </button>

                        {showPopup && (
                            <div className={cs('share_showPopup')}>
                                <button
                                    className={cs('Share_Action')}
                                    onClick={() => setShowPopup(false)}
                                >
                                    ❌ Đóng
                                </button>
                                <button className={cs('Share_Action')} onClick={handleCopyLink}>
                                    📋 Sao chép link
                                </button>
                                <button
                                    className={cs('Share_Action')}
                                    onClick={() => handleShare('Facebook')}
                                >
                                    📘 Facebook
                                </button>
                                <button
                                    className={cs('Share_Action')}
                                    onClick={() => handleShare('Twitter')}
                                >
                                    🐦 Twitter
                                </button>
                            </div>
                        )}
                        {/* </div> */}
                    </div>
                </div>
                <div className={cs('Show_Cmt')}>
                    {blog?.commentBlog
                        ?.slice()
                        .reverse()
                        .map((comment) => (
                            <div key={comment.id} className={cs('comment_item')}>
                                <img
                                    src={comment.avatar || 'default-avatar.png'}
                                    alt="Avatar"
                                    className={cs('avatar')}
                                />
                                <div>
                                    <div className={cs('comment_content')}>
                                        <p className={cs('comment_name')}>
                                            {comment.guestName || 'Ẩn danh'}
                                        </p>
                                        <p className={cs('comment_text')}>{comment.content}</p>
                                    </div>
                                    <p className={cs('comment_date')}>
                                        {new Date(comment.createOn).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className={cs('suggest-bar')}>
                {suggestByAuthor.length > 0 && (
                    <div>
                        <h3>Bài viết cùng tác giả</h3>
                        <div className={cs('suggest-by-author')}>
                            {suggestByAuthor.map((b) => (
                                <div key={b.id} className={cs('suggest-item')}>
                                    <Link
                                        to={'/DetailBlog'}
                                        state={{ blog: b }}
                                        className={cs('btn-read-more')}
                                    >
                                        <img
                                            src={b.thumbnail}
                                            alt={b.title}
                                            className={cs('suggest-img')}
                                        />
                                    </Link>
                                    <Link
                                        to={'/DetailBlog'}
                                        state={{ blog: b }}
                                        className={cs('btn-read-more')}
                                    >
                                        {b.title}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3>Gợi ý bài viết khác</h3>
                    <div className={cs('suggest')}>
                        {suggestBlogs.map((b) => (
                            <div key={b.id} className={cs('suggest-item')}>
                                <Link
                                    to={'/DetailBlog'}
                                    state={{ blog: b }}
                                    className={cs('btn-read-more')}
                                >
                                    <img
                                        src={b.thumbnail}
                                        alt={b.title}
                                        className={cs('suggest-img')}
                                    />
                                </Link>
                                <Link
                                    to={'/DetailBlog'}
                                    state={{ blog: b }}
                                    className={cs('btn-read-more')}
                                >
                                    {b.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailBlog;
