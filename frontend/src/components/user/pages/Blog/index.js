import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
const cs = classNames.bind(styles);

const Blog = ({ currentUser }) => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([
        "Mẹo lập trình", "Hướng dẫn", "Xu hướng lập trình", "Kinh Nghiệm", "Thử thách", "Câu Hỏi"
    ]);
    const [query, setQuery] = useState({
        search: "",
        category: "",
        sort: "newest",
        page: 1,
        postsPerPage: 10,
        dateFilter: ""
    });
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchBlogs();
        }, 1000);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get("http://localhost:5180/api/BlogController", {
                params: Object.fromEntries(
                    Object.entries(query).filter(([_, value]) => value !== "")
                ),
            });
            setBlogs(response.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu blog:", error);
            setBlogs([]);
        }
    };

    const handleChange = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value });
    };

    return (
        <div className={cs("container")}> 
            <h2 className={cs("title")}>Danh sách bài viết</h2>
            <div className={cs("search-bar")}>
                <input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm bài viết..."
                    value={query.search}
                    onChange={handleChange}
                />
            </div>
            <div className={cs("blog")}> 
                <div className={cs("sidebar")}> 
                    <h3>Danh mục</h3>
                    <div className={cs("category-list")}>
                        {categories.map((category, index) => (
                            <button key={index} onClick={() => setQuery({ ...query, category })}>
                                {category}
                            </button>
                        ))}
                    </div>
                    <h3>Lọc</h3>
                    <input
                        type="date"
                        name="dateFilter"
                        value={query.dateFilter}
                        onChange={handleChange}
                    />
                    <h3>Sắp xếp</h3>
                    <select name="sort" value={query.sort} onChange={handleChange}>
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                    <button className={cs("reset-button")} onClick={() => setQuery({
                        search: "", category: "", sort: "newest", page: 1, postsPerPage: 10, dateFilter: ""
                    })}>Reset</button>
                </div>
                <div className={cs("blog-list")}> 
                    {blogs.map((blog) => (
                        <div key={blog.id} className={cs("blog-item")}>
                            <img src={blog.thumbnail} alt={blog.title} className={cs("thumbnail")} />
                            <div className={cs("content")}> 
                                <h2>{blog.title}</h2>
                                <p>{blog.description}</p>
                                <p>Ngày đăng: {blog.CreateOn}</p>
                                <div className={cs("actions")}>
                                    <button>Đọc thêm</button>
                                    {currentUser?.id === blog.userId && (
                                        <>
                                            <button>Chỉnh sửa</button>
                                            <button>Xóa</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cs("pagination")}>
                <button
                    disabled={query.page === 1}
                    onClick={() => setQuery({ ...query, page: query.page - 1 })}
                >
                    Trước
                </button>
                <span>Trang {query.page}</span>
                <button
                    onClick={() => setQuery({ ...query, page: query.page + 1 })}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default Blog;