import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import NoImage from '~/assets/images/BlogThumbnail/unnamed.png';

import { useContext } from 'react';
import AuthContext from '~/context/AuthContext';

const cs = classNames.bind(styles);

const Blog = () => {

    const { userRole } = useContext(AuthContext);


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
    const [dateFilter, setDateFilter] = useState({
        day: "",
        month: "",
        year: ""
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
        console.log("Blog UserId:", blogs.userId);
    }, [blogs]);
    
    useEffect(() => {
        handleFilterByDate();
    }, [dateFilter]);
    
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
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateFilter((prev) => ({ ...prev, [name]: value }));
    };
    const handleFilterByDate = () => {
        let filterString = "";
        if (dateFilter.year) {
            filterString = dateFilter.year;
            if (dateFilter.month) {
                filterString += `-${dateFilter.month.padStart(2, "0")}`;
                if (dateFilter.day) {
                    filterString += `-${dateFilter.day.padStart(2, "0")}`;
                }
            }
        }
        setQuery((prev) => ({ ...prev, dateFilter: filterString }));
    };
    const filteredBlogs = sortedBlogs.filter(blog => {
        if (!query.dateFilter) return true; // Nếu không chọn ngày thì hiển thị tất cả
    
        const blogDate = new Date(blog.createOn);
        const blogYear = blogDate.getFullYear();
        const blogMonth = blogDate.getMonth() + 1;
        const blogDay = blogDate.getDate();
    
        if (dateFilter.year && blogYear !== Number(dateFilter.year)) return false;
        if (dateFilter.month && blogMonth !== Number(dateFilter.month)) return false;
        if (dateFilter.day && blogDay !== Number(dateFilter.day)) return false;
    
        return true;
    });
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

            {/* DataBase */}
            <div className={cs("blog")}> 

                {/* sidebar */}
                <div className={cs("sidebar")}> 
                    
                     {/* category */}
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
                    {/* End category */}

                    {/* sortBy */}
                    <h3>Sắp xếp theo</h3>
                    <div className={cs("sort-controls")}>
                        <select name="sortBy" value={query.sortBy} onChange={handleChange}>
                            <option value="createOn">Ngày đăng</option>
                            <option value="title">Tiêu đề</option>
                        </select>
                        <button onClick={() => setQuery(prev => ({ ...prev, IsDescending: !prev.IsDescending }))}>
                            {query.IsDescending ? "Giảm dần" : "Tăng dần"}
                        </button>
                    </div>
                    {/* End sortBy */}

                    {/* date-filter */}
                    <h3>Lọc theo ngày</h3>
                    <div className={cs("date-filter")}>
                        <div className={cs("DateInput")}>
                            <select name="day" value={dateFilter.day} onChange={handleDateChange}>
                                <option value="">Ngày</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>

                            <select name="month" value={dateFilter.month} onChange={handleDateChange}>
                                <option value="">Tháng</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <input 
                                type="number" 
                                name="year" 
                                placeholder="năm" 
                                value={dateFilter.year} 
                                onChange={handleDateChange} 
                            />
                        </div>

                        <button onClick={handleFilterByDate}>Lọc</button>
                    </div>
                    {/* End date-filter */}

                    {/* reset-button */}
                    <button className={cs("reset-button")} onClick={handleReset}>Reset</button>
                    {/* End reset-button */}
                
                </div>
                {/* End sidebar */}

                {/* BBloglist */}
                <div className={cs("blog-list")}> 
                    {sortedBlogs.map((blog) => (
                        <div key={blog.id} className={cs("blog-item")}>
                        <img 
                            src={blog.thumbnail && blog.thumbnail.startsWith("http") ? blog.thumbnail : NoImage}
                            alt={blog.title} 
                            className={cs("thumbnail")} 
                        />

                            <div className={cs("content")}>
                                <h2>{blog.title}</h2>
                                <p>{blog.description}</p>
                                {blog.categoryBlog && blog.categoryBlog.trim() !== "" && (
                                    <div className={cs("category-tags")}>
                                        {blog.categoryBlog.split(",").map((category, index) => (
                                            <button
                                                key={index}
                                                className={cs("category-item")}
                                                onClick={() => handleCategoryChange(category.trim())}
                                            >
                                                {category.trim()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <p>Ngày đăng: {blog.createOn ? new Date(blog.createOn + "Z").toLocaleDateString("vi-VN") : "Không có dữ liệu"}</p>

                                <div className={cs("actions")}>
                                    <div className={cs('userPart')}>
                                        {userRole !== 'guest' && (
                                            <>
                                                <button className={cs("edit")}>Chỉnh sửa</button>
                                                <button className={cs("delete")}>Xóa</button>
                                            </>
                                        )}
                                    </div>
                                    <button>Đọc thêm</button>
                                </div>

                            </div>
                        </div>
                    ))} 
                </div>
                {/* End Bloglist */}
            </div>
            {/* End DataBase */}

            {/* pagination */}
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
            {/* End pagination */}

        </div>
    );
};

export default Blog;
