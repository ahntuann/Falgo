import React, { useEffect, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './CreateBlog.module.scss';
import { useNavigate } from 'react-router-dom';
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import QuillImageUploader from 'quill-image-uploader';
import { Quill } from 'react-quill';

const cs = classNames.bind(styles);
Quill.register('modules/imageUploader', QuillImageUploader);

const CreateBlog = () => {
    const userNow = localStorage.getItem('user');
    const userObject = userNow ? JSON.parse(userNow) : null;
    const userId = userObject?.id || '';
    const Email = userObject?.email || '';
    const Name = userObject?.userName || '';
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userid: userId,
        guestEmail: Email,
        guestName: Name,
        thumbnail: '',
        title: '',
        description: '',
        content: '',
        imageBlog: '',
        categoryBlog: [],
        createon: new Date().toISOString().split('T')[0],
        DatePublic: new Date().toISOString().split('T')[0],
    });

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
            guestEmail: Email,
            guestName: Name,
        }));
    }, [userId, Email, Name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'DatePublic' && value < formData.createon) {
            alert('Ngày công bố phải bắt đầu từ hôm nay');
            setFormData({ ...formData, [name]: formData.createon });
            return;
        }
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
            console.log({ userObject });
            await axios.post(
                'http://localhost:5180/api/BlogController',
                {
                    ...formData,
                    userid: userId,
                    guestEmail: Email,
                    guestName: Name,
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
            <h2>Tạo bài viết</h2>

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
                                maxLength={250}
                                required
                            />
                        </div>

                        <div className={cs('Creator_space')}>Tác giả: {Name}</div>

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

                        <div className={cs('DatePublic_space')}>
                            Ngày Công bố:
                            <input
                                type="date"
                                name="DatePublic"
                                value={formData.DatePublic}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={cs('InforImg_space')}>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }} // Ẩn input file
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

export default CreateBlog;
