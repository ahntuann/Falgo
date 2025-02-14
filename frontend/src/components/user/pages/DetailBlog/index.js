import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AuthContext from "~/context/AuthContext";

import classNames from "classnames/bind";
import styles from "./DetailBlog.module.scss";
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';
import { Link } from "react-router-dom";


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

    const suggestByAuthor = useMemo(() => {
        return allBlogs.filter(b => b.userId === blog?.userId && b.id !== blog?.id).slice(0, 3);
    }, [allBlogs, blog]);

    const suggestBlogs = useMemo(() => {
        return allBlogs.filter(b => b.id !== blog?.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [allBlogs, blog]);

    if (!blog) return <div className={cs("error-message")}>Không tìm thấy bài viết!</div>;

    const handleDelete = async (blogId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
        console.log("ID nhận được trong handleDelete:", blogId);
        
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://localhost:5180/api/BlogController/${blogId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include"
            });
    
            if (response.status === 401) {
                alert("Bạn cần đăng nhập để xóa bài viết!");
                return;
            }
    
            const text = await response.text(); 
            window.location.href= "/blog";
            if (response.ok) {
                alert("Xóa bài viết thành công!");
                allBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
            } else {
                alert(`Xóa thất bại! Server trả về: ${text}`);
            }
        } catch (error) {

        }
    };

    return (
        <div className={cs("show-container")}>
            <div className={cs("show-Conent")}>
                <div className={cs("show-content-informationinformation")}>
                    <div>
                        <h2>{blog.title}</h2>
                        <p><strong>Tác giả:</strong> {blog.guestName}</p>
                        <p>{blog.description}</p>
                        <p><strong>Danh mục:</strong> {blog.categoryBlog}</p>
                        <p><strong>Ngày đăng:</strong> {new Date(blog.createOn).toLocaleDateString("vi-VN")}</p>                
                        {userRole !== "guest" && userObject?.id === blog.userId && (
                            <div className={cs("action-buttons")}>
                                <Link to={'/BlogUpdate'} state={{blog}} className={cs("edit")}>Chỉnh sửa</Link>
                                <button className={cs("delete-btn")} onClick={() => handleDelete(blog.id)} > Xóa</button>
                            </div>
                        )}
                    </div>
                    <img src={ blog.thumbnail ? blog.thumbnail : NoImage} 
                    alt={blog.title} className={cs("thumbnail")} />
                </div>
                <div className={cs("show-content")}> 
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
            </div>
            <div className={cs("suggest-bar")}>
                {suggestByAuthor.length > 0 && (
                    <div>
                        <h3>Bài viết cùng tác giả</h3>
                        <div className={cs("suggest-by-author")}>
                            {suggestByAuthor.map(b => (
                                <div key={b.id} className={cs("suggest-item")}>
                                    <img src={b.thumbnail} alt={b.title} className={cs("suggest-img")} />
                                    <Link to={'/DetailBlog'} state={{blog: b}} className={cs("btn-read-more")}>{b.title}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                <h3>Gợi ý bài viết khác</h3>
                    <div className={cs("suggest")}>
                        {suggestBlogs.map(b => (
                            <div key={b.id} className={cs("suggest-item")}>
                                <img src={b.thumbnail} alt={b.title} className={cs("suggest-img")} />
                                <Link to={'/DetailBlog'} state={{blog: b}} className={cs("btn-read-more")}>{b.title}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
    
};

export default DetailBlog;
