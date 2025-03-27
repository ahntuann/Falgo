import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import classNames from 'classnames/bind';
import 'react-quill/dist/quill.snow.css';
import styles from './AddContest.module.scss';
import { AdminLayout } from '~/layouts';

const cx = classNames.bind(styles);

export default function AddContest() {
    const [contest, setContest] = useState({
        contestId: '',
        contestName: '',
        dueTime: '',
        totalPoint: '',
        level: '',

        endDate: '',
        banner: '',
    });

    const [bannerFile, setBannerFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔹 Handle Quill Editor Change
    const handleQuillChange = (value) => {
        setContest({ ...contest, contestName: value });
    };

    // 🔹 Handle Input Change
    const handleChange = (e) => {
        setContest({ ...contest, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
        setBannerFile(e.target.files[0]);
        console.log(bannerFile);
    };
    const uploadBanner = async (bannerFile) => {
        if (!bannerFile) {
            console.error('No file selected!');
            return null;
        }
        const formData = new FormData();
        formData.append('file', bannerFile);
        try {
            const response = await axios.post(
                'http://localhost:5180/api/ContestManagement/Upload',
                formData,
            );

            return response.data;
        } catch (error) {
            console.error('Upload failed:', error.response?.data || error.message);
            alert('Upload failed. Check your authorization.');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bannerFile) {
            console.error('No filee selected!'); // Debugging step
            alert('Please select a banner image.');
            return;
        }
        setLoading(true);

        try {
            const bannerURL = await uploadBanner(bannerFile); // Upload banner first
            if (!bannerURL) throw new Error('Banner upload failed');

            const contestData = { ...contest, banner: bannerURL };
            console.log(contestData);

            await axios.post('http://localhost:5180/api/ContestManagement/AddContest', contestData);
            alert('Contest added successfully!');
            setContest({
                contestId: '',
                contestName: '',
                dueTime: '',
                totalPoint: '',
                level: '',
                endDate: '',
                banner: '',
            });
            setBannerFile(null);
        } catch (error) {
            console.error('Error adding contest:', error);
            alert('Failed to add contest');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className={cx('container')}>
                <h2 className={cx('title')}>Add New Contest</h2>
                <form onSubmit={handleSubmit} className={cx('form')}>
                    <label className={cx('label')}>Contest Id:</label>
                    <input
                        classname={cx('editor')}
                        type="text"
                        name="contestId"
                        placeholder="ID"
                        value={contest.contestId}
                        onChange={handleChange}
                        required
                    />
                    {/* 🔹 Contest Name (Quill Editor) */}
                    <label className={cx('label')}>Contest Name:</label>
                    <ReactQuill
                        className={cx('editor')}
                        value={contest.contestName}
                        onChange={handleQuillChange}
                    />

                    {/* 🔹 Due Time */}
                    <label className={cx('label')}>Due Time (minutes):</label>
                    <input
                        type="number"
                        name="dueTime"
                        value={contest.dueTime}
                        onChange={handleChange}
                        className={cx('input')}
                        required
                    />

                    {/* 🔹 Total Points */}
                    <label className={cx('label')}>Total Points:</label>
                    <input
                        type="number"
                        name="totalPoint"
                        value={contest.totalPoint}
                        onChange={handleChange}
                        className={cx('input')}
                        required
                    />

                    {/* 🔹 Level */}
                    <label className={cx('label')}>Level:</label>
                    <select
                        name="level"
                        value={contest.level}
                        onChange={handleChange}
                        className={cx('select')}
                        required
                    >
                        <option value="">Select Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    <label className={cx('label')}>End Date:</label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={contest.endDate}
                        onChange={handleChange}
                        className={cx('input')}
                        required
                    />

                    <label className={cx('label')}>Banner Image:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className={cx('file-input')}
                        accept="image/*"
                        required
                    />

                    <button type="submit" className={cx('submit-btn')} disabled={loading}>
                        {loading ? 'Submitting...' : 'Add Contest'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
