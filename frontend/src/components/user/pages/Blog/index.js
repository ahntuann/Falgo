import React, { useState } from "react";
import useAuth from "~/hooks/useAuth.js";
import "./Blog.css";

const postsData = [
    {
        id: 1,
        title: "Học React từ A-Z",
        description: "Bài viết hướng dẫn học React từ cơ bản đến nâng cao",
        category: "Lập trình",
        tags: ["React", "JavaScript", "Web Dev"],
        thumbnail: "https://via.placeholder.com/150",
        date: "2025-02-07",
    },
    // Thêm nhiều bài viết tại đây
];

const Blog = () => {
    const { userRole } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("date"); // Sắp xếp theo ngày
    const postsPerPage = 10;

    // Lọc bài viết theo tìm kiếm
    const filteredPosts = postsData
        .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => (sortBy === "date" ? new Date(b.date) - new Date(a.date) : a.title.localeCompare(b.title)));

    // Xác định bài viết hiển thị
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="blog-container">
            <h2 className="BlogTilte">Blog</h2>
            {/* Thanh tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Sắp xếp theo ngày</option>
                <option value="title">Sắp xếp theo tiêu đề</option>
            </select>

            {/* Danh sách bài viết */}
            <div className="post-list">
                {currentPosts.map((post) => (
                    <div key={post.id} className="post">
                        <img src={post.thumbnail} alt={post.title} className="thumbnail" />
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        <span className="category">{post.category}</span>
                        <span className="date">{post.date}</span>
                        <div className="tags">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="tag">#{tag}</span>
                            ))}
                        </div>
                        <button className="read-more">Đọc thêm</button>
                        {userRole === "user" && (
                            <>
                                <button className="delete">Xóa</button>
                                <button className="edit">Chỉnh sửa</button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <div className="sidebar">
                <h3>Danh mục</h3>
                <ul>
                    <li>Công nghệ</li>
                    <li>Lập trình</li>
                    <li>Cuộc sống</li>
                </ul>

                <h3>Bài viết mới nhất</h3>
                <ul>
                    <li>Bài viết A</li>
                    <li>Bài viết B</li>
                </ul>

                <h3>Bài viết phổ biến</h3>
                <ul>
                    <li>Bài viết X</li>
                    <li>Bài viết Y</li>
                </ul>
            </div>

            {/* Phân trang */}
            <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Trước
                </button>
                <span>Trang {currentPage}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastPost >= filteredPosts.length}>
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default Blog;