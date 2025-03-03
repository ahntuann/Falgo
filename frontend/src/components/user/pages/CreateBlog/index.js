import React, { useEffect, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './CreateBlog.module.scss';
import { useNavigate } from 'react-router-dom';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';

const cs = classNames.bind(styles);

const CreateBlog = () => {
    const userNow = localStorage.getItem('user');
    const userObject = userNow ? JSON.parse(userNow) : null;
    const userId = userObject?.id || '';
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userid: userId,
        guestEmail: userObject.guestEmail,
        guestName: userObject.guestName,
        thumbnail: '',
        title: '',
        description: '',
        content: '',
        imageBlog: '',
        categoryBlog: [],
        createon: new Date().toISOString().split('T')[0],
        DatePublic: new Date().toISOString().split('T')[0],
    });

    const categoryOptions = [
        'Mẹo lập trình',
        'Hướng dẫn',
        'Xu hướng lập trình',
        'Kinh Nghiệm',
        'Thử thách',
        'Câu Hỏi',
    ];

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            categoryBlog: checked
                ? [...prevState.categoryBlog, value]
                : prevState.categoryBlog.filter((cat) => cat !== value),
        }));
    };

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            userid: userId,
            guestEmail: userObject.guestEmail,
            guestName: userObject.guestName,
        }));
    }, [userId, userObject]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert('Lỗi: Không tìm thấy User ID. Vui lòng đăng nhập lại!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5180/api/BlogController',
                {
                    ...formData,
                    userid: userId,
                    categoryBlog: formData.categoryBlog.join(', '),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            alert('Tạo blog thành công!');
            navigate('/UserBlog');
        } catch (error) {
            console.error('Lỗi khi tạo blog:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

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
                    <label>
                        Ngày Công bố:
                        <input
                            type="date"
                            name="DatePublic"
                            value={formData.DatePublic}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
