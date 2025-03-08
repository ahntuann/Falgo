import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';

import classNames from 'classnames/bind';
import styles from './BlogUpdate.module.scss';

const cs = classNames.bind(styles);

const BlogUpdate = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const blog = location.state?.blog;

    const [formData, setFormData] = useState({
        thumbnail: '',
        title: '',
        description: '',
        content: '',
        imageBlog: '',
        categoryBlog: [],
        status: 'Duyệt Lại',
    });

    useEffect(() => {
        if (blog) {
            setFormData({
                thumbnail: blog.thumbnail || NoImage,
                title: blog.title || '',
                description: blog.description || '',
                content: blog.content || '',
                status: formData.status,
                imageBlog: blog.imageBlog || '',
                categoryBlog: Array.isArray(blog.categoryBlog)
                    ? blog.categoryBlog
                    : blog.categoryBlog
                    ? blog.categoryBlog.split(', ').map((cat) => cat.trim())
                    : [], 
            });
        }
    }, [blog, formData.status]);

    const categoryOptions = [
        'Mẹo lập trình',
        'Hướng dẫn',
        'Xu hướng lập trình',
        'Kinh Nghiệm',
        'Thử thách',
        'Câu Hỏi',
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            categoryBlog: checked
                ? [...prevState.categoryBlog, value]
                : prevState.categoryBlog.filter((cat) => cat !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Dữ liệu trước khi gửi:', formData);

        if (!blog) {
            alert('Bài viết không tồn tại!');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');

            const response = await axios.put(
                `http://localhost:5180/api/BlogController/${blog.id}`,
                { ...formData, categoryBlog: formData.categoryBlog.join(', ') },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.status === 200) {
                alert('Cập nhật bài viết thành công!');
                navigate('/UserBlog');
            } else {
                alert('Cập nhật thất bại!');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
            alert('Có lỗi xảy ra!');
        }
    };

    if (!blog) return <div>Không tìm thấy bài viết!</div>;

    return (
        <div className={cs('container')}>
            <h2>Chỉnh sửa bài viết</h2>
            <form onSubmit={handleSubmit}>
                <img
                    src={formData.thumbnail ? formData.thumbnail : NoImage}
                    alt={formData.title}
                    className={cs('thumbnail')}
                    onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
                />
                <div className={cs('EditBlog')}>
                    <label>
                        Thumbnail URL:
                        <input
                            type="text"
                            name="thumbnail"
                            value={formData.thumbnail}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Tiêu đề:
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Mô tả:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Nội dung:
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Ảnh/Video(mp4)
                        <textarea
                            name="imageBlog"
                            value={formData.imageBlog}
                            onChange={handleChange}
                        />
                    </label>

                    <label>Phân loại:</label>
                    <div className={cs('category_item')}>
                        {categoryOptions.map((category) => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={formData.categoryBlog.includes(category)}
                                    onChange={handleCategoryChange}
                                />
                                {category}
                            </label>
                        ))}
                    </div>

                    <button type="submit">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default BlogUpdate;
