import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import AuthContext from '~/context/AuthContext';
import { useContext } from 'react';

import classNames from 'classnames/bind';
import styles from './BlogUpdate.module.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const cs = classNames.bind(styles);

const BlogUpdate = () => {
    const { userRole } = useContext(AuthContext);
    const navigate = useNavigate();

    const location = useLocation();
    const blog = location.state?.blog;
    console.log({ blog });

    const [formData, setFormData] = useState({
        guestName: '',
        thumbnail: '',
        title: '',
        description: '',
        content: '',
        createOn: '',
        imageBlog: '',
        categoryBlog: [],
        status: 'Duyệt lại',
    });

    useEffect(() => {
        if (blog) {
            setFormData({
                guestName: blog.guestName || '',
                thumbnail: blog.thumbnail || NoImage,
                title: blog.title || '',
                description: blog.description || '',
                content: blog.content || '',
                status: formData.status,
                createOn: formData.createOn,
                imageBlog: blog.imageBlog || '',
                categoryBlog: Array.isArray(blog.categoryBlog)
                    ? blog.categoryBlog
                    : blog.categoryBlog
                    ? blog.categoryBlog.split(', ').map((cat) => cat.trim())
                    : [],
            });
        }
    }, [blog, formData.status]);

    const handleContentChange = (content) => {
        setFormData((prev) => ({
            ...prev,
            content,
        }));
    };

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

    const categoryOptions = [
        'Thử thách',
        'Hướng dẫn',
        'Kinh nghiệm',
        'Mẹo lập trình',
        'Xu hướng lập trình',
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
                if (userRole === 'user') {
                    navigate('/UserBlog');
                }
                navigate('/Blog');
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
                <div className={cs('Infor_space')}>
                    <div className={cs('User_infor_space')}>
                        <div className={cs('title_space')}>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Tiêu đề bài viết"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className={cs('Creator_space')}>Tác giả: {formData.guestName}</div>

                        <div className={cs('description_space')}>
                            <input
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả bài viết"
                                maxLength={500}
                            />
                        </div>

                        <div className={cs('category_space')}>
                            <div className={cs('category_space_title')}>Danh mục:</div>
                            <div className={cs('category_space_checkbox')}>
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
                                ))}{' '}
                            </div>
                        </div>

                        <div className={cs('DateCreate_space')}>
                            Ngày tạo: {formData.DatePublic}
                        </div>
                    </div>

                    <div className={cs('InforImg_space')}>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                thumbnail: reader.result,
                                            }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <img
                                src={formData.thumbnail ? formData.thumbnail : NoImage}
                                alt={formData.title}
                                className={cs('thumbnail')}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = NoImage;
                                }}
                            />
                        </label>
                    </div>
                </div>

                <div className={cs('Content_space')}>
                    <label>
                        Nội dung:
                        <ReactQuill
                            value={formData.content}
                            onChange={handleContentChange}
                            modules={modules}
                            formats={formats}
                        />
                    </label>
                </div>
                <button type="submit">Lưu</button>
            </form>
        </div>
    );
};

export default BlogUpdate;
