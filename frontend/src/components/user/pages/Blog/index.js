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
    const userNow = localStorage.getItem('user');
    const userObject = userNow ? JSON.parse(userNow) : null;

    const [originalBlogs, setOriginalBlogs] = useState([]); // Lưu dữ liệu gốc
    const [filteredBlogs, setFilteredBlogs] = useState([]); // Lưu danh sách đã lọc
    
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

    const totalPages = Math.ceil(filteredBlogs.length / query.postsPerPage);

    const startIndex = (query.page - 1) * query.postsPerPage;
    const endIndex = startIndex + query.postsPerPage;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
    const debounceRef = useRef(null);

    const [dateFilter, setDateFilter] = useState({
        day: "",
        month: "",
        year: ""
    });
    


    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchBlogs();
        }, 1000);
        return () => clearTimeout(debounceRef.current);
    }, [query]);
 
    useEffect(() => {
        handleFilterByDate();
    }, [dateFilter, originalBlogs]); // Lọc khi dữ liệu gốc hoặc bộ lọc thay đổi
    
    useEffect(() => {
        setFilteredBlogs(prevBlogs => [...prevBlogs].sort((a, b) => {
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
        }));
    }, [query.sortBy, query.IsDescending]);
    
    const fetchBlogs = async () => {
        try {
            const params = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== "")
            );
            const response = await axios.get("http://localhost:5180/api/BlogController", { params });
    
            let fetchedBlogs = response.data || [];
    
            // Lọc theo danh mục nếu query.category có giá trị
            if (query.category) {
                fetchedBlogs = fetchedBlogs.filter(blog => {
                    if (!blog.categoryBlog) return false; // Tránh lỗi nếu categoryBlog null
                    const categoriesArray = blog.categoryBlog.split(",").map(cat => cat.trim());
                    return categoriesArray.includes(query.category);
                });
            }
    
            // Lọc theo từ khóa tìm kiếm
            if (query.search) {
                const searchLower = query.search.toLowerCase();
                fetchedBlogs = fetchedBlogs.filter(blog => 
                    blog.title.toLowerCase().includes(searchLower) || 
                    blog.description.toLowerCase().includes(searchLower)
                );
            }
    
            // Sắp xếp ngay khi nhận dữ liệu
            fetchedBlogs = fetchedBlogs.sort((a, b) => {
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
    
            setOriginalBlogs(fetchedBlogs);
            setFilteredBlogs(fetchedBlogs);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu blog:", error);
            setOriginalBlogs([]);
            setFilteredBlogs([]);
        }
    };
    
    
    



    

    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setQuery((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };
    

    const handleCategoryChange = (category) => {
        setQuery(prev => ({
            ...prev,
            category: prev.category === category ? "" : category
        }));
    };
    


    const handleReset = () => {
        setQuery({
            search: "",
            category: "",
            sortBy: "createOn",
            IsDescending: false,
            page: 1,
            postsPerPage: 10,
            dateFilter: ""  // Reset bộ lọc ngày
        });
    
        setDateFilter({ day: "", month: "", year: "" }); // Xóa dữ liệu ngày đã chọn
        setFilteredBlogs(originalBlogs); // Reset danh sách blog về ban đầu
    };
    
    

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateFilter((prev) => ({
            ...prev,
            [name]: value  // Cập nhật giá trị lọc
        }));
    };
    
    const handleFilterByDate = () => {
        const { day, month, year } = dateFilter;
    
        const filtered = originalBlogs.filter(blog => {
            const blogDate = new Date(blog.createOn); // Đổi blog.createOn thành Date object
            const blogDay = blogDate.getDate();
            const blogMonth = blogDate.getMonth() + 1; // Tháng bắt đầu từ 0
            const blogYear = blogDate.getFullYear();
    
            return (
                (year ? blogYear === Number(year) : true) &&
                (month ? blogMonth === Number(month) : true) &&
                (day ? blogDay === Number(day) : true)
            );
        });
    
        setFilteredBlogs(filtered); // Cập nhật danh sách hiển thị
    };
    
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
    
            const text = await response.text(); // Đọc response dưới dạng text
            console.log("Response từ server:", text);
    
            if (response.ok) {
                alert("Xóa bài viết thành công!");
                setFilteredBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
            } else {
                alert(`Xóa thất bại! Server trả về: ${text}`);
            }
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error);
            alert("Có lỗi xảy ra!");
        }
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

                {/* Bloglist */}
                <div className={cs("blog-list")}> 
                    {paginatedBlogs.map((blog) => (
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
                                        {userRole !== 'guest' && userObject && userObject.id === blog.userId && (
                                            <>
                                                <button className={cs("edit")}>Chỉnh sửa</button>
                                                <button className={cs("delete")} onClick={() => handleDelete(blog.id)}>
                                                    Xóa
                                                </button>
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
                {/* Nút về trang đầu */}
                <button
                    disabled={query.page === 1}
                    onClick={() => setQuery(prev => ({ ...prev, page: 1 }))}
                >
                    Đầu
                </button>

                {/* Nút lùi trang */}
                <button
                    disabled={query.page === 1}
                    onClick={() => setQuery(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                    Trước
                </button>

                {/* Danh sách số trang */}
                <div className={cs("paginationnumber")}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setQuery({ ...query, page: index + 1 })}
                            className={query.page === index + 1 ? "active" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {/* Nút tiến trang */}
                <button
                    disabled={query.page >= totalPages}
                    onClick={() => setQuery(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                    Sau
                </button>

                {/* Nút đến trang cuối */}
                <button
                    disabled={query.page === totalPages}
                    onClick={() => setQuery(prev => ({ ...prev, page: totalPages }))}
                >
                    Cuối
                </button>
            </div>
            {/* End pagination */}

        </div>
    );
};

export default Blog;
