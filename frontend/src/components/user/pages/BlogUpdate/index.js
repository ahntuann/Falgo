import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "~/context/AuthContext";
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';

import classNames from "classnames/bind";
import styles from "./BlogUpdate.module.scss";

const cs = classNames.bind(styles);

const BlogUpdate = () => {
    const navigate = useNavigate();
    const { userRole } = useContext(AuthContext);
    
    const location = useLocation();
    const blog = location.state?.blog;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        categoryBlog: "",
        thumbnail: "",
    });

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                description: blog.description || "",
                content: blog.content || "",
                categoryBlog: blog.categoryBlog || "",
                thumbnail: blog.thumbnail || NoImage,
            });
        }
    }, [blog]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Dữ liệu trước khi gửi:", formData); // Kiểm tra dữ liệu
    
        if (!blog) {
            alert("Bài viết không tồn tại!");
            return;
        }
    
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.put(
                `http://localhost:5180/api/BlogController/${blog.id}`,
                { ...formData, categoryBlog: formData.categoryBlog.trim() }, // Trim ở đây trước khi gửi
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                alert("Cập nhật bài viết thành công!");
                navigate("/blog");
            } else {
                alert("Cập nhật thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    if (!blog) return <div>Không tìm thấy bài viết!</div>;

    return (
        <div className={cs("container")}>
            <h2>Chỉnh sửa bài viết</h2>
            <form onSubmit={handleSubmit}>
                <img src={ formData.thumbnail ? formData.thumbnail : NoImage} 
                    alt={formData.title} className={cs("thumbnail")} />
                <div className={cs("EditBlog")}>
                    <label>
                        Thumbnail URL:
                        <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />
                    </label>
                    <label>
                        Tiêu đề:
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </label>
                    <label>
                        Mô tả:
                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                    </label>
                    <label>
                        Nội dung:
                        <textarea name="content" value={formData.content} onChange={handleChange} required />
                    </label>
                    <label>
                        Phân loại:
                        <textarea name="categoryBlog" value={formData.categoryBlog} onChange={handleChange} required />
                    </label>
                    <button type="submit">Lưu</button>
                </div>
            </form>
        </div>
    );
};

export default BlogUpdate;
