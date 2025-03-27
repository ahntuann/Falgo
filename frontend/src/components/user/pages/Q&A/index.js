import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import classNames from 'classnames/bind';
import styles from './QA.module.scss';
const cx = classNames.bind(styles);
const QA = () => {
    const [categories, setCategories] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [question, setquestion] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState({
        UserId: '',
        PageNumber: 1,
        PageSize: 15,
    });
    const [questions, setQuestions] = useState({
        content: '',
        userId: '',
        answer: [],
    });
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
        ],
    };
    const handleChange = (e) => {
        setQuestions({ ...questions, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        fetchQuestion();
    }, []);
    const fetchQuestion = async () => {
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(query).filter(([_, value]) => value !== ''),
            );
            const response = await axios.get('http://localhost:5180/api/QandA', {
                params: filteredQuery,
            });
            setquestion(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching problems', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5180/api/QandA/AddQuestion', questions);
            alert('Thêm câu hỏi thành công');
        } catch (error) {
            console.error('Error adding contest:', error);
            alert('Failed to add contest');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <aside className="sidebar">
                {categories.map((category, index) => (
                    <a
                        key={index}
                        href="#"
                        className={index === categories.length - 1 ? 'active' : ''}
                    >
                        {category.name}
                    </a>
                ))}
            </aside>
            <main className="content">
                <h2>Tạo Câu Hỏi Mới</h2>
                <form onSubmit={handleSubmit} className={cx('form')}>
                    <ReactQuill value={questions.content} onChange={handleChange} />
                    <button type="submit" className={cx('submit-btn')} disabled={loading}>
                        {loading ? 'Submitting...' : ' Thêm câu hỏi'}
                    </button>
                </form>
                <div className="user-info">
                    <div>
                        <h4>
                            {questions.userName} <span className="role">Giáo viên</span>
                        </h4>
                        <p className="timestamp">Hôm kia lúc {questions.time}</p>
                    </div>
                </div>
                <p className="question-text">{questions.content}</p>
                <ul className="answers">
                    {questions.answer.map((option, index) => (
                        <li key={index}>{option}</li>
                    ))}
                </ul>
                <div className="tags">
                    <span className="tag">Lớp 8</span>
                    <span className="tag">Giáo dục công dân</span>
                </div>
            </main>

            {/* Ranking */}
            <aside className="ranking">
                <h3>Xếp hạng</h3>
                {ranking.map((user, index) => (
                    <div key={index} className="rank-item">
                        <span>{user.name}</span>
                        <span className="points">{user.points} GP</span>
                    </div>
                ))}
            </aside>
        </div>
    );
};

export default QA;
