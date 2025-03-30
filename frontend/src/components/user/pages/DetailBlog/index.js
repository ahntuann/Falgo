import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AuthContext from '~/context/AuthContext';

import classNames from 'classnames/bind';
import styles from './DetailBlog.module.scss';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const cs = classNames.bind(styles);

const DetailBlog = () => {
    const { userRole } = useContext(AuthContext);
    const userNow = localStorage.getItem('user');

    const userObject = userNow ? JSON.parse(userNow) : null;
    const location = useLocation();
    const [blog, setBlog] = useState(location.state?.blog);
    console.log('sdfgdsfg', blog);
    const [allBlogs, setAllBlogs] = useState([]);

    const [liked, setLiked] = useState();
    const [comments, setComments] = useState('');

    const [showPopupShare, setshowPopupShare] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);

    const [bookmarked, setBookmarked] = useState();
    const [userAvatar, setUserAvatar] = useState(
        'https://img.hoidap247.com/picture/question/20210904/large_1630765811060.jpg',
    );
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'link',
        'image',
        'video',
    ];

    useEffect(() => {
        if (location.state?.blog) {
            setBlog(location.state.blog);
        }
    }, [location.state]);

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
                setBookmarked(
                    blog.blogBookmark.some((Bookmark) => Bookmark.userID === userObject.id),
                );
            }
        }
        const fetchUserAvatar = async () => {
            try {
                const userString = localStorage.getItem('user');
                if (userString) {
                    const user = JSON.parse(userString);

                    if (user.avatar) {
                        const fullAvatarUrl = `http://localhost:5180${user.avatar}`;
                        setUserAvatar(fullAvatarUrl);
                        return;
                    }

                    const userId = user.id;
                    const response = await axios.get(
                        `http://localhost:5180/api/user/profile/${userId}`,
                    );

                    if (response.data.avatar) {
                        const fullAvatarUrl = `http://localhost:5180${response.data.avatar}`;
                        setUserAvatar(fullAvatarUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };
        fetchUserAvatar();
    }, [blog, userObject.id, userRole]);

    const handleCommentChange = (content) => {
        setComments(content);
    };
    const suggestByAuthor = useMemo(() => {
        return allBlogs.filter((b) => b.userId === blog?.userId && b.id !== blog?.id).slice(0, 3);
    }, [allBlogs, blog]);

    const suggestByCategory = useMemo(() => {
        if (!blog || !blog.categoryBlog) return [];

        const blogCategories = blog.categoryBlog.split(', ').map((c) => c.trim());

        return allBlogs
            .filter((b) => {
                if (b.id === blog.id || !b.categoryBlog) return false;

                const bCategories = b.categoryBlog.split(', ').map((c) => c.trim());
                return bCategories.some((category) => blogCategories.includes(category));
            })
            .slice(0, 3);
    }, [allBlogs, blog]);

    const newestBlogs = useMemo(() => {
        return allBlogs
            .filter((b) => b.id !== blog?.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
    }, [allBlogs, blog]);

    if (!blog) return <div className={cs('error-message')}>Không tìm thấy bài viết!</div>;

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
            } catch (error) {
                alert('Lỗi khi xóa bình luận:', error);
            }
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
                alert(`Thao tác không thành công! Lỗi: ${result}`);
            }
        } catch (error) {
            alert('Lỗi kết nối đến server!');
        }
    };

    const handleComment = async () => {
        if (comments.trim() === '') {
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
                    avatar: userAvatar ?? NoImage,
                    guestName: userObject?.userName ?? 'Ẩn danh',
                    content: comments,
                    blogId: blog.id,
                    userId: userObject?.id ?? null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Cảm ơn đã bình luận!!');
                setBlog((prevBlog) => ({
                    ...prevBlog,
                    commentBlog: [...prevBlog.commentBlog, result.comment],
                }));

                setComments('');
            } else {
                alert('Gửi bình luận thất bại!');
            }
        } catch (error) {
            alert('Lỗi kết nối đến server!');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Đã sao chép link!');
        setshowPopupShare(false);
    };

    const handleShare = async (platform) => {
        const confirmShare = window.confirm(`Bạn có muốn chia sẻ lên ${platform} không?`);
        if (!confirmShare) return;
        try {
            const token = localStorage.getItem('accessToken');

            const currentURL = window.location.href;

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
                const result = await response.json();

                setBlog((prevBlog) => ({
                    ...prevBlog,
                    blogShare: [...(prevBlog.blogShare || []), result],
                }));
            } else {
                alert('Lỗi chia sẻ:', await response.text());
            }
        } catch (error) {
            alert('Lỗi kết nối:', error);
        }
        setshowPopupShare(false);
    };

    const updateBlogStatus = async (blogId) => {
        let reason = '';

        reason = prompt('Hãy nhập lý do từ chối:', 'Vi phạm cộng đồng!!!');
        if (reason === null) return;

        try {
            const token = localStorage.getItem('accessToken');
            const updatedBlog = { ...blog, status: 'Báo cáo', note: reason };
            const response = await fetch(`http://localhost:5180/api/BlogController/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedBlog),
            });

            if (response.ok) {
                alert(`Cảm ơn đã báo cáo bài viết`);
            } else {
                const text = await response.text();
                alert(`Cập nhật thất bại! Lỗi từ server: ${text}`);
            }
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

    const handleEditComment = async (commentId, currentContent) => {
        const newContent = prompt(
            'Hãy nhập nội dung bình luận:',
            <div
                dangerouslySetInnerHTML={{
                    __html: currentContent,
                }}
            />,
        );

        if (newContent === null || newContent === currentContent) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5180/api/BlogCommentController/${commentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                    },
                    body: JSON.stringify({ content: newContent }),
                },
            );

            if (!response.ok) {
                alert('Cập nhật bình luận thất bại!');
            } else {
                setBlog((prevBlog) => ({
                    ...prevBlog,
                    commentBlog: prevBlog.commentBlog.map((comment) =>
                        comment.id === commentId ? { ...comment, content: newContent } : comment,
                    ),
                }));

                alert('Cập nhật thành công!');
                setActiveCommentId(null);
            }
        } catch (error) {
            alert('Lỗi khi cập nhật bình luận:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
            try {
                const response = await fetch(
                    `http://localhost:5180/api/BlogCommentController?commentId=${commentId}`,
                    {
                        method: 'DELETE',
                    },
                );

                if (!response.ok) {
                    alert('Xóa bình luận thất bại!');
                }

                blog.commentBlog = blog.commentBlog.filter((comment) => comment.id !== commentId);
            } catch (error) {
                alert('Lỗi khi xóa bình luận:', error);
            }
        }
        setActiveCommentId(null);
    };

    const handleReportComment = async (commentId, currentContent) => {
        let reason = '';

        reason = prompt('Hãy nhập lý do báo cáo:', 'Vi phạm cộng đồng!!!');
        if (reason === null) return;

        try {
            const response = await fetch(
                `http://localhost:5180/api/BlogCommentController/${commentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                    },
                    body: JSON.stringify({
                        content: currentContent,
                        status: 'Báo cáo',
                        note: reason,
                    }),
                },
            );

            if (response.ok) {
                alert(`Cảm ơn đã báo cáo bài viết`);
                setBlog((prevBlog) => ({
                    ...prevBlog,
                    commentBlog: prevBlog.commentBlog.map((comment) =>
                        comment.id === commentId ? { ...comment, note: reason } : comment,
                    ),
                }));

                setActiveCommentId(null);
            } else {
                const text = await response.text();
                alert(`Cập nhật thất bại! Lỗi từ server: ${text}`);
            }
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

    const handleBookmark = async () => {
        if (!userObject?.id) {
            alert('Bạn cần đăng nhập để like bài viết!');
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(
                'http://localhost:5180/api/BlogBookmarkController/ToggleBookmark',
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
                setBookmarked(result.bookmarked);
                console.log(result);

                const updatedBlog = { ...blog };
                if (result.bookmarked) {
                    updatedBlog.blogBookmark.push({ userID: userObject.id });
                } else {
                    updatedBlog.blogBookmark = updatedBlog.blogBookmark.filter(
                        (Bookmark) => Bookmark.userID !== userObject.id,
                    );
                }
                setBlog(updatedBlog);

                alert(result.message);
            } else {
                const result = await response.text();
                alert(`Thao tác không thành công! Lỗi: ${result}`);
            }
        } catch (error) {
            console.error('Lỗi mạng:', error);
        }
    };
    return (
        <div className={cs('container')}>
            <div className={cs('Blog_Content')}>
                <div className={cs('Infor_space')}>
                    <div className={cs('User_infor_space')}>
                        <div className={cs('title_space')}>{blog.title}</div>

                        <div className={cs('Creator_space')}>Tác giả: {blog.guestName}</div>

                        <div className={cs('description_space')}>{blog.description}</div>

                        <div className={cs('category_space')}>
                            <div className={cs('category_space_title')}>
                                Danh mục: {blog.categoryBlog}
                            </div>
                        </div>

                        <div className={cs('DateCreate_space')}>
                            Ngày đăng: {new Date(blog.createOn).toLocaleDateString('vi-VN')}
                        </div>
                        {userRole !== 'guest' && userObject?.id === blog.userId && (
                            <div className={cs('action_buttons')}>
                                <Link
                                    to={'/BlogUpdate'}
                                    state={{ blog }}
                                    className={cs('edit_btn')}
                                >
                                    Chỉnh sửa
                                </Link>
                                <button
                                    className={cs('delete_btn')}
                                    onClick={() => handleDelete(blog.id)}
                                >
                                    {' '}
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={cs('InforImg_space')}>
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
                </div>

                <div className={cs('Content_space')}>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
                <div className={cs('Action_space')}>
                    <div className={cs('Like_space')}>
                        <div className={cs('Number_Like')}>{blog?.blogLike?.length || 0}</div>
                        <button className={cs('Like_Action', { liked })} onClick={handleLike}>
                            {liked ? '💙 Đã thích' : '🤍 Thích'}
                        </button>
                    </div>

                    <div className={cs('Share_space')}>
                        <div className={cs('Number_Share')}>{blog?.blogShare?.length || 0}</div>

                        <button
                            className={cs('Share_Action')}
                            onClick={() => setshowPopupShare(true)}
                        >
                            🔗 Chia sẻ
                        </button>

                        {showPopupShare && (
                            <div className={cs('share_showPopup')}>
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
                                <button
                                    className={cs('Share_Action')}
                                    onClick={() => setshowPopupShare(false)}
                                >
                                    ❌ Đóng
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={cs('Report_Action')}>
                        <button
                            className={cs('UpdateStatus')}
                            onClick={() => updateBlogStatus(blog.id)}
                        >
                            🚩 Report
                        </button>
                    </div>

                    <div className={cs('Bookmark_space')}>
                        <button
                            className={cs('Bookmark_Action', { bookmarked })}
                            onClick={handleBookmark}
                        >
                            {bookmarked ? '🔖 Đã lưu' : '📌 Lưu'}
                        </button>
                    </div>
                </div>
                <div className={cs('cmt_Space')}>
                    <ReactQuill
                        value={comments}
                        onChange={handleCommentChange}
                        modules={modules}
                        formats={formats}
                    />
                    <button className={cs('cmt_Action')} onClick={handleComment}>
                        Lưu
                    </button>
                </div>
                <div className={cs('Cmt_space')}>
                    <div className={cs('Show_Cmt')}>
                        {blog?.commentBlog
                            ?.slice()
                            .reverse()
                            .filter(
                                (comment) =>
                                    comment.status !== 'Từ chối' ||
                                    comment.userId === userObject?.id,
                            )
                            .map((comment) => (
                                <div key={comment.id} className={cs('comment_item')}>
                                    <img
                                        src={comment.avatar || 'default-avatar.png'}
                                        alt="Avatar"
                                        className={cs('avatar')}
                                    />
                                    <div className={cs('comment_main')}>
                                        <div className={cs('comment_content')}>
                                            <p className={cs('comment_name')}>
                                                {comment.guestName || 'Ẩn danh'}
                                            </p>
                                            <p className={cs('comment_text')}>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: comment.content,
                                                    }}
                                                />
                                            </p>
                                            {comment.status === 'Báo cáo' &&
                                                comment.userId === userObject?.id && (
                                                    <div className={cs('Note')}>
                                                        Cảnh báo: <p>{comment.note}</p>
                                                    </div>
                                                )}
                                            {comment.status === 'Từ chối' &&
                                                comment.userId === userObject?.id && (
                                                    <div className={cs('Note')}>
                                                        Từ chối: <p>{comment.note}</p>
                                                    </div>
                                                )}
                                        </div>
                                        <p className={cs('comment_date')}>
                                            {new Date(comment.createOn).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        className={cs('menu_button')}
                                        onClick={() =>
                                            setActiveCommentId(
                                                activeCommentId === comment.id ? null : comment.id,
                                            )
                                        }
                                    >
                                        ⋮
                                    </button>

                                    {activeCommentId === comment.id && (
                                        <div className={cs('Cmt_showPopup')}>
                                            {(comment.userId === userObject?.id ||
                                                comment.userId === null) && (
                                                <div className={cs('userCmt_showPopup')}>
                                                    <button
                                                        className={cs('Cmts_Action')}
                                                        onClick={() =>
                                                            handleEditComment(
                                                                comment.id,
                                                                comment.content,
                                                            )
                                                        }
                                                    >
                                                        ✏️ Sửa
                                                    </button>
                                                    <button
                                                        className={cs('Cmts_Action')}
                                                        onClick={() =>
                                                            handleDeleteComment(comment.id)
                                                        }
                                                    >
                                                        🗑️ Xóa
                                                    </button>
                                                </div>
                                            )}

                                            <button
                                                className={cs('Cmts_Action')}
                                                onClick={() =>
                                                    handleReportComment(comment.id, comment.content)
                                                }
                                            >
                                                🚩 Báo cáo
                                            </button>

                                            <button
                                                className={cs('Cmts_Action')}
                                                onClick={() => setActiveCommentId(null)}
                                            >
                                                ❌ Đóng
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className={cs('suggest_bar')}>
                <h2 className={cs('suggest_title')}>Gợi ý bài viết</h2>

                {suggestByCategory.length > 0 && (
                    <div className={cs('suggest_section')}>
                        <h3 className={cs('suggest_heading')}>📌 Bài viết cùng chuyên mục</h3>
                        <div className={cs('suggest_list', 'column')}>
                            {suggestByCategory.map((b) => (
                                <div key={b.id} className={cs('suggest_item')}>
                                    <div className={cs('LinkTo_space')}>
                                        <Link
                                            to={'/DetailBlog'}
                                            state={{ blog: b }}
                                            className={cs('btn-read-more')}
                                        >
                                            <img
                                                src={b.thumbnail}
                                                alt={b.title}
                                                className={cs('suggest_img')}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = NoImage;
                                                }}
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
                                    <div>{b.categoryBlog}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {newestBlogs.length > 0 && (
                    <div className={cs('suggest_section')}>
                        <h3 className={cs('suggest_heading')}>🔥 Bài viết mới nhất</h3>
                        <div className={cs('suggest_list', 'column')}>
                            {newestBlogs.map((b) => (
                                <div key={b.id} className={cs('suggest_item')}>
                                    <div className={cs('LinkTo_space')}>
                                        <Link
                                            to={'/DetailBlog'}
                                            state={{ blog: b }}
                                            className={cs('btn-read-more')}
                                        >
                                            <img
                                                src={b.thumbnail}
                                                alt={b.title}
                                                className={cs('suggest_img')}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = NoImage;
                                                }}
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
                                    <div>{b.categoryBlog}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {suggestByAuthor.length > 0 && (
                    <div className={cs('suggest_section')}>
                        <h3 className={cs('suggest_heading')}>✍️ Bài viết cùng tác giả</h3>
                        <div className={cs('suggest_list', 'column')}>
                            {suggestByAuthor.map((b) => (
                                <div key={b.id} className={cs('suggest_item')}>
                                    <div className={cs('LinkTo_space')}>
                                        <Link
                                            to={'/DetailBlog'}
                                            state={{ blog: b }}
                                            className={cs('btn-read-more')}
                                        >
                                            <img
                                                src={b.thumbnail}
                                                alt={b.title}
                                                className={cs('suggest_img')}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = NoImage;
                                                }}
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
                                    <div>{b.categoryBlog}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailBlog;
