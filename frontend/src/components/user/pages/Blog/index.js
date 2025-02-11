import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
const cs = classNames.bind(styles);

const Blog = ({ currentUser }) => {
    const [blogs, setBlogs] = useState([]);
    const [categories] = useState([
        "Mẹo lập trình", "Hướng dẫn", "Xu hướng lập trình", "Kinh Nghiệm", "Thử thách", "Câu Hỏi"
    ]);
    const [query, setQuery] = useState({
        search: "",
        category: "",
        sortBy: "createOn", // Đổi thành đúng tên trường JSON
        IsDescending: true,
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

    useEffect(() => {
        console.log("Dữ liệu blog nhận được:", blogs);
    }, [blogs]);

    const fetchBlogs = async () => {
        try {
            const params = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== "")
            );
            console.log("Fetching blogs with:", params);
            const response = await axios.get("http://localhost:5180/api/BlogController", { params });
            console.log("Response data:", response.data);
            setBlogs(response.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu blog:", error);
            setBlogs([]);
        }
    };

    const sortedBlogs = [...blogs].sort((a, b) => {
        if (query.sortBy === "createOn") {
            return query.IsDescending
                ? new Date(b.createOn) - new Date(a.createOn)
                : new Date(a.createOn) - new Date(b.createOn);
        } else if (query.sortBy === "title") {
            return query.IsDescending
                ? b.title.localeCompare(a.title)
                : a.title.localeCompare(b.title);
        }
        return 0;
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuery((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleCategoryChange = (category) => {
        setQuery(prev => ({ ...prev, category: prev.category === category ? "" : category }));
    };

    const handleReset = () => {
        setQuery({
            search: "",
            category: "",
            sortBy: "createOn", // Đổi thành đúng tên trường JSON
            IsDescending: false,
            page: 1,
            postsPerPage: 10,
            dateFilter: ""
        });
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
                            <button 
                                key={index} 
                                className={cs({ active: query.category === category })} 
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <h3>Sắp xếp theo</h3>
                    <select name="sortBy" value={query.sortBy} onChange={handleChange}>
                        <option value="createOn">Ngày đăng</option>
                        <option value="title">Tiêu đề</option>
                    </select>

                    <button onClick={() => setQuery(prev => ({ ...prev, IsDescending: !prev.IsDescending }))}>
                        {query.IsDescending ? "Giảm dần" : "Tăng dần"}
                    </button>

                    <h3>
                        Lọc <input
                        type="date"
                        name="dateFilter"
                        value={query.dateFilter}
                        onChange={handleChange}
                    />  
                    </h3>
                    
                    <button className={cs("reset-button")} onClick={handleReset}>Reset</button>
                </div>
                <div className={cs("blog-list")}> 
                    {sortedBlogs.map((blog) => (
                        <div key={blog.id} className={cs("blog-item")}>
                            <img src={blog.thumbnail} alt={blog.title} className={cs("thumbnail")} />
                            <div className={cs("content")}>
                                <h2>{blog.title}</h2>
                                <p>{blog.description}</p>
                                <p>{blog.CategoryBlog}</p>
                                <p>Ngày đăng: {blog.createOn ? new Date(blog.createOn + "Z").toLocaleDateString("vi-VN") : "Không có dữ liệu"}</p>

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
                    onClick={() => setQuery(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                    Trước
                </button>
                <span>Trang {query.page}</span>
                <button
                    onClick={() => setQuery(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default Blog;
