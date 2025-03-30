import { AdminLayout } from '~/layouts';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './BlogCommentManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const cs = classNames.bind(styles);

function BlogCommentManagement() {
    const debounceRef = useRef(null);

    const navigate = useNavigate();
    const role = JSON.parse(sessionStorage.getItem('admin'));
    const [comments, setComments] = useState([]);
    const [query, setQuery] = useState({
        search: '',
        status: '',
        category: '',
        sortBy: 'createOn',
        IsDescending: true,
        page: 1,
        postsPerPage: 10,
        dateFilter: '',
    });
    const [categories] = useState([
        'Vi phạm cộng đồng',
        'Phân biệt chủng tộc',
        'Ngôn từ năng mạ',
        'Cổ xúy bạo lực',
        'Chống đối nhà nước',
    ]);
    const [status] = useState(['Bình thường', 'Báo cáo', 'Từ chối']);

    const startIndex = (query.page - 1) * query.postsPerPage;
    const endIndex = startIndex + query.postsPerPage;
    const totalPages = Math.ceil(comments.length / query.postsPerPage);
    const paginated = comments.slice(startIndex, endIndex);

    useEffect(() => {
        if (!role) {
            navigate('/');
        }
    }, [role]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchComment();
        }, 1000);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuery((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const fetchComment = async () => {
        try {
            const params = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );

            const response = await axios.get('http://localhost:5180/api/BlogCommentController', {
                params,
            });
            let fetchedComments = response.data || [];

            if (query.search) {
                const searchLower = query.search.toLowerCase();
                fetchedComments = fetchedComments.filter(
                    (comment) =>
                        (comment.guestName?.toLowerCase() || '').includes(searchLower) ||
                        (comment.content?.toLowerCase() || '').includes(searchLower) ||
                        (comment.status?.toLowerCase() || '').includes(searchLower) ||
                        (comment.note?.toLowerCase() || '').includes(searchLower),
                );
            }

            if (query.status) {
                fetchedComments = fetchedComments.filter(
                    (comment) => comment.status === query.status,
                );
            }

            if (query.dateFilter) {
                fetchedComments = fetchedComments.filter((comment) =>
                    comment.createOn.startsWith(query.dateFilter),
                );
            }
            fetchedComments = fetchedComments.sort((a, b) => {
                if (query.sortBy === 'createOn') {
                    return query.IsDescending
                        ? new Date(b.createOn) - new Date(a.createOn)
                        : new Date(a.createOn) - new Date(b.createOn);
                }
                return 0;
            });
            if (query.status) {
                fetchedComments = fetchedComments.filter((comment) =>
                    comment.status.includes(query.status),
                );
            }
            if (query.category) {
                fetchedComments = fetchedComments.filter((comment) =>
                    comment.note
                        ? comment.note.toLowerCase().includes(query.category.toLowerCase())
                        : false,
                );
            }

            setComments(fetchedComments);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu bình luận:', error);
            setComments([]);
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
                fetchComment();
            } catch (error) {
                alert('Lỗi khi xóa bình luận:', error);
            }
        }
    };

    const handleEditComment = async (commentId, currentContent, status) => {
        const newContent = prompt('Hãy nhập nội dung bình luận:', currentContent);

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
                    body: JSON.stringify({ content: newContent, status: status }),
                },
            );

            if (!response.ok) {
                alert('Cập nhật bình luận thất bại!');
            } else {
                alert('Cập nhật thành công!');
                fetchComment();
            }
        } catch (error) {
            alert('Lỗi khi cập nhật bình luận:', error);
        }
    };

    const handlestatusComment = async (commentId, currentContent, Action) => {
        let reason = '';
        let status = 'Cảnh báo';
        if (Action === 'Rejcet') {
            reason = prompt('Hãy nhập lý do từ chối:', 'Vi phạm cộng đồng!!!');
            if (reason === null) return;
            status = 'Từ chối';
        } else if (Action === 'Allow') {
            status = 'Bình thường';
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

                    body: JSON.stringify({
                        content: currentContent,
                        status: status,
                        note: reason,
                    }),
                },
            );

            if (response.ok) {
                alert(`Thao tác thành công`);
                fetchComment();
            } else {
                const text = await response.text();
                alert(`Cập nhật thất bại! Lỗi từ server: ${text}`);
            }
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };
    return (
        <AdminLayout>
            <div className={cs('container')}>
                <div className={cs('topbar')}>
                    <div className={cs('Search_bar')}>
                        <input
                            type="text"
                            name="search"
                            placeholder="Tìm kiếm..."
                            value={query.search}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cs('Date_Picker')}>
                        <DatePicker
                            selected={query.dateFilter ? new Date(query.dateFilter) : null}
                            onChange={(date) => {
                                const formattedDate = date ? date.toISOString().split('T')[0] : '';
                                setQuery((prev) => ({ ...prev, dateFilter: formattedDate }));
                            }}
                            dateFormat="yyyy-MM-dd"
                            isClearable
                            placeholderText="Chọn ngày"
                        />
                    </div>
                    <div className={cs('Filter_select')}>
                        <select name="category" value={query.category} onChange={handleChange}>
                            <option value="">Phân Loại</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cs('status_select')}>
                        <select name="status" value={query.status} onChange={handleChange}>
                            <option value="">Trạng thái</option>
                            {status.map((status, index) => (
                                <option key={index} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cs('Sort_btn')}>
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
                    <div className={cs('reset_btn')}>
                        <button
                            className={cs('Reset')}
                            onClick={() =>
                                setQuery({
                                    search: '',
                                    status: '',
                                    category: '',
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
                <div>
                    {paginated.length > 0 ? (
                        paginated.map((comment) => (
                            <div key={comment.id} className={cs('comment_space')}>
                                <div className={cs('comment_content')}>
                                    <div className={cs('comment_infor')}>
                                        <div>{comment.guestName}</div>
                                        <div>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: comment.content,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            {new Date(comment.createOn).toLocaleString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                                <div className={cs('comment_Note')}>
                                    <div>Trạng thái: {comment.status}</div>
                                    <div>{comment.note}</div>
                                    <div className={cs('comment_action')}>
                                        <button onClick={() => handleDeleteComment(comment.id)}>
                                            Xóa
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleEditComment(
                                                    comment.id,
                                                    comment.content,
                                                    comment.status,
                                                )
                                            }
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlestatusComment(
                                                    comment.id,
                                                    comment.content,
                                                    'Rejcet',
                                                )
                                            }
                                        >
                                            Từ chối
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlestatusComment(
                                                    comment.id,
                                                    comment.content,
                                                    'Allow',
                                                )
                                            }
                                        >
                                            Thông qua
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Chưa có bình luận nào.</p>
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
export default BlogCommentManagement;
