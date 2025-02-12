import { useState } from 'react';
import axios from 'axios';

function DateFilter({ usertype, onFilterData }) {
    // Accept usertype as a prop
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = { startDate, endDate };

        try {
            let apiUrl = '';

            if (usertype === 'user') {
                apiUrl = 'http://localhost:5180/api/AdminDashboard/user';
            } else if (usertype === 'problem') {
                apiUrl = 'http://localhost:5180/api/AdminDashboard/problem';
            } else {
                apiUrl = 'http://localhost:5180/api/AdminDashboard/submissions';
            }

            const response = await axios.post(apiUrl, requestData, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Filtered Data:', response.data);
            onFilterData(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Start Date:</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />

            <label>End Date:</label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />

            <button type="submit">Submit</button>
        </form>
    );
}

export default DateFilter;
