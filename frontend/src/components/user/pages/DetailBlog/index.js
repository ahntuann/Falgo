import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AuthContext from "~/context/AuthContext";

import classNames from "classnames/bind";
import styles from "./DetailBlog.module.scss";

const cs = classNames.bind(styles);

const DetailBlog = () => {
    const { userRole } = useContext(AuthContext);
    const userNow = localStorage.getItem("user");
    const userObject = userNow ? JSON.parse(userNow) : null;

    const location = useLocation();
    const blog = location.state?.blog;

    const [allBlogs, setAllBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:5180/api/BlogController");
                setAllBlogs(response.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách blog:", error);
            }
        };

        fetchBlogs();
    }, []);

    // Gợi ý bài viết cùng tác giả
    const suggestByAuthor = useMemo(() => {
        return allBlogs.filter(b => b.userId === blog?.userId && b.id !== blog?.id).slice(0, 3);
    }, [allBlogs, blog]);

    // Gợi ý bài viết ngẫu nhiên
    const suggestBlogs = useMemo(() => {
        return allBlogs.filter(b => b.id !== blog?.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [allBlogs, blog]);

    if (!blog) return <div className={cs("error-message")}>Không tìm thấy bài viết!</div>;

    return (
        <div className={cs("show-container")}>
            {/* Hiển thị nội dung bài viết */}
            <div className={cs("show-content")}>
                <h2>{blog.title}</h2>
                <p><strong>Danh mục:</strong> {blog.categoryBlog}</p>
                <p><strong>Tác giả:</strong> {blog.guestName}</p>
                <p><strong>Ngày đăng:</strong> {blog.createOn}</p>
    
                <img src={blog.thumbnail} alt={blog.title} className={cs("thumbnail")} />
    
                <p>{blog.description}</p>
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    
                {/* Nút chỉnh sửa/xóa */}
                {userRole !== "guest" && userObject?.id === blog.userId && (
                    <div className={cs("action-buttons")}>
                        <button className={cs("edit-btn")}>Chỉnh sửa</button>
                        <button className={cs("delete-btn")}>Xóa</button>
                    </div>
                )}
            </div>
    
            {/* Thanh gợi ý */}
            <div className={cs("suggest-bar")}>
                {/* Kiểm tra nếu có bài viết cùng tác giả mới hiển thị */}
                {suggestByAuthor.length > 0 && (
                    <div className={cs("suggest-by-author")}>
                        <h3>Bài viết cùng tác giả</h3>
                        {suggestByAuthor.map(b => (
                            <div key={b.id} className={cs("suggest-item")}>
                                <img src={b.thumbnail} alt={b.title} className={cs("suggest-img")} />
                                <h4>{b.title}</h4>
                            </div>
                        ))}
                    </div>
                )}

                {/* Gợi ý bài viết khác */}
                <div className={cs("suggest")}>
                    <h3>Gợi ý bài viết khác</h3>
                    {suggestBlogs.map(b => (
                        <div key={b.id} className={cs("suggest-item")}>
                            <img src={b.thumbnail} alt={b.title} className={cs("suggest-img")} />
                            <h4>{b.title}</h4>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
    
};

export default DetailBlog;
