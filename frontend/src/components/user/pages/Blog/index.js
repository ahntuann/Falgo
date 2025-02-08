import React, { useState } from "react";
import "./Blog.css"; // Thêm CSS nếu cần

const posts = [
    {
        id: 1,
        title: "Bài viết đầu tiên",
        description: "Đây là mô tả ngắn cho bài viết đầu tiên.",
        category: "Công nghệ",
        tags: ["React", "JavaScript"],
        thumbnail: "https://via.placeholder.com/150",
        date: "2025-02-06",
    },
    {
        id: 2,
        title: "Lập trình web với React",
        description: "Cách sử dụng React để tạo website hiện đại.",
        category: "Lập trình",
        tags: ["Web", "Frontend"],
        thumbnail: "https://via.placeholder.com/150",
        date: "2025-02-05",
    },
    // Thêm nhiều bài viết khác...
];

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    // Lọc bài viết theo tìm kiếm
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xác định bài viết hiển thị trong trang hiện tại
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="blog-container">
            {/* Thanh tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />

            <div className="blog-content">
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
                                    <span key={index} className="tag">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <button className="read-more">Đọc thêm</button>
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
